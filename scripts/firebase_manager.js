import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, orderBy, limit, doc, writeBatch, arrayUnion, arrayRemove, deleteDoc, setDoc, startAfter } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updatePassword, deleteUser, browserLocalPersistence, signOut, setPersistence  } from "firebase/auth";
import Analytics from './analytics';
import FileManager from './file_manager';
import { Platform } from 'react-native';
import NetInfo from "@react-native-community/netinfo";

// Global variable to store network status
let isConnected = true;

// Set up the NetInfo event listener
NetInfo.addEventListener(state => {
    isConnected = state.isConnected && state.isInternetReachable;
});

const firebaseConfig = {
    apiKey: "AIzaSyAEKGpKMMy7guqWHnp6y-KJr5ll9kRFbBc",
    authDomain: "fun-libs.firebaseapp.com",
    projectId: "fun-libs",
    storageBucket: "fun-libs.appspot.com",
    messagingSenderId: "960757043969",
    appId: "1:960757043969:web:2f7d6fb97df2137d9e0100",
    measurementId: "G-3STXM20LRK"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export default class FirebaseManager {
    static currentUserData = {
        auth: null,
        firestoreData: null
    };

    static getCurrentUserData() {
        return this.currentUserData;
    }

    static async CreateUserWithEmailAndPassword(email, password) {
        await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                this.currentUserData.auth = user;
                Analytics.log("Created user " + JSON.stringify(user.uid));
            })
            .catch((error) => {
                Analytics.log("Error creating user " + JSON.stringify(error.message));
            });
    }

    static async CreateUser(signUpMethod, email, password, username, avatarID) {
        return new Promise(async (resolve, reject) => {
            try {
                switch (signUpMethod) {
                    case "email":
                        const user = await this.CreateUserWithEmailAndPassword(email, password);
                        await this.AddDocumentToCollection("users", {
                            email: email,
                            username: username,
                            avatarID: avatarID
                        }, 
                        this.currentUserData.auth.uid);
                        Analytics.log("Successfully created user");
                        resolve(user);
                        break;
                    default:
                        const error = "Could not find signUpMethod";
                        Analytics.log(error);
                        reject(error);
                        break;
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    static SignInWithEmailAndPassword(email, password) {
        return new Promise((resolve, reject) => {
            FirebaseManager.SetAuthPersistenceToLocal();
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    this.currentUserData.auth = user;
                    Analytics.log("Signed in as " + JSON.stringify(user.uid));
                    resolve(user); // or resolve('Signed in successfully')
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    Analytics.log("Error signing in " + errorMessage);
                    reject(errorMessage);  // Reject promise with error message
                });
        });
    }

    static authStateListeners = [];

    static addAuthStateListener(listener) {
        this.authStateListeners.push(listener);
    }

    static OnAuthStateChanged() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                const uid = user.uid;
                this.currentUserData.auth = user;

                // Fetch user data from Firestore and store in currentUserData
                await this.fetchUserData(uid);
                this.authStateListeners.forEach(listener => listener(user));
                Analytics.log("Auth stated changed to Signed in for " + uid);
            } else {
                // User is signed out
                this.currentUserData = { auth: null, firestoreData: null }; // Reset the field to null
                this.authStateListeners.forEach(listener => listener(null));
                Analytics.log("Auth stated changed to Signed out");
            }
        });
    }

    static async fetchUserData() {
        let uid = null;
        if (this.currentUserData.auth) {
            uid = this.currentUserData.auth.uid;
        }
        try {
            console.log("READING FOR UID: " + uid);
            if (uid) {
                console.log("FETCHING USER DATA FOR: " + uid);
                const userDocSnap = await getDoc(doc(db, "users", uid));
                if (userDocSnap.exists()) {
                    this.currentUserData.firestoreData = userDocSnap.data();
                    console.log(JSON.stringify(userDocSnap.data()));
                } else {
                    console.log("No document found for UID: " + uid);
                }
            } else {
                // Handle the case where uid is null or undefined
                this.currentUserData = {
                    auth: auth.currentUser,
                    firestoreData: null
                };
            }
        } catch (error) {
            Analytics.log("Error fetching user data: " + error);
            this.currentUserData = null;
        }
    }

    static async updatePassword(newPassword) {
        const user = this.currentUserData.auth;
        try {
            await updatePassword(user, newPassword);
            Analytics.log("Password updated successfully for user " + user.uid);
        } catch (error) {
            Analytics.log("Error updating password: " + error.message);
            throw error; // Re-throw the error so it can be caught and handled by the caller
        }
    }

    static SetAuthPersistenceToLocal() {
        if (Platform.OS === 'web') {
            setPersistence(auth, browserLocalPersistence)
                .then(() => {
                    Analytics.log("Auth persistence set to LOCAL for web");
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    Analytics.log("Error setting local persistence on auth for web: " + errorMessage);
                });
        } else if (Platform.OS === 'android' || Platform.OS === 'ios') {
            // Using React Native Firebase's setPersistence method
            // auth.setPersistence(auth, browserLocalPersistence)
            //     .then(() => {
            //         Analytics.log("Auth persistence set to LOCAL for " + Platform.OS);
            //     })
            //     .catch((error) => {
            //         const errorMessage = error.message;
            //         Analytics.log("Error setting local persistence on auth for " + Platform.OS + ": " + errorMessage);
            //     });
        }
    }

    static SignOut() {
        signOut(auth).then(() => {
            Analytics.log("Signout method called");
        }).catch((error) => {
            Analytics.log("Error signing out: " + error);
        });
    }

    static async DeleteUser() {
        const user = this.currentUserData.auth;
    
        if (!user) {
            Analytics.log("No user is currently signed in. Cannot delete.");
            return;
        }
    
        const uid = user.uid;
    
        // 1. Delete user data from Firestore
        try {
            // Assuming the user's data is stored in a collection named "users" with their UID as the document ID.
            const userDocRef = doc(db, "users", uid);
            await deleteDoc(userDocRef);
            Analytics.log(`Deleted user data from Firestore for UID: ${uid}`);
        } catch (error) {
            Analytics.log(`Error deleting user data from Firestore: ${error.message}`);
            throw error;
        }
    
        // 2. Delete the Firebase Auth user
        try {
            await deleteUser(user);
            Analytics.log(`Deleted Firebase Auth user with UID: ${uid}`);
        } catch (error) {
            Analytics.log(`Error deleting Firebase Auth user: ${error.message}`);
            throw error;
        }
    }

    static async AddDocumentToCollection(collection_, data, id = null) {
        try {
            if (id) {
                await setDoc(doc(db, collection_, id), data);
            } else {
                const docRef = await addDoc(collection(db, collection_), data);
                id = docRef.id;
            }
            Analytics.log("Added document to " + collection_ + "\nData: " + JSON.stringify(data));
            return id;
        } catch (error) {
            Analytics.log("Error adding document to " + collection_ + "\nError: " + error);
        }
    }

    /**
     * Fetches data from a Firestore collection based on provided filter options and pagination settings.
     * 
     * @param {string} collection_ - The name of the Firestore collection to query.
     * @param {Object} [filterOptions={}] - An object containing filter options for the query.
     * @param {boolean} [filterOptions.official] - If true, fetches documents where "official" is true. If false, fetches documents where "official" is either false or not set.
     * @param {Array<string>} [filterOptions.docIds] - An array of document IDs to filter by.
     * @param {string} [filterOptions.sortBy] - Determines the sorting of the results. Can be "likes", "trending", or "newest".
     * @param {string} [filterOptions.dateRange] - Filters documents based on date ranges. Can be "allTime", "today", "thisWeek", "thisMonth", or "thisYear".
     * @param {boolean} [filterOptions.playable] - If set, fetches documents where "playable" matches the provided value.
     * @param {firebase.firestore.DocumentSnapshot} [lastVisibleDoc=null] - The last document from the previous query, used for pagination.
     * @param {boolean} [filterOptions.published] - If set, fetches documents where "published" matches the provided value.
     * @param {number} [pageSize=10] - The number of documents to retrieve in a single query (pagination size).
     * 
     * * @returns {Promise<{data: Array<any>, lastDocument: firebase.firestore.DocumentSnapshot | null}>} - Returns a promise that resolves to an object containing the current page of results and the last document in the current page. The last document can be used for subsequent paginated queries.
     * 
     * @example
     * // Initial query to fetch the first page of results:
     * const lastDoc = await FirebaseManager.ReadDataFromDatabase("yourCollectionName", { official: true, sortBy: "likes" });
     * 
     * // Fetching the next page of results:
     * const nextLastDoc = await FirebaseManager.ReadDataFromDatabase("yourCollectionName", { official: true, sortBy: "likes" }, lastDoc);
     */
    static async ReadDataFromDatabase(
        collection_,
        filterOptions = {
            category: "all",
            docIds: undefined,
            sortBy: undefined,
            dateRange: undefined,
            playable: undefined
        },
        lastVisibleDoc = null,
        pageSize = 10
    ) {
        if (!isConnected) {
            console.log("No internet: data may be out of date");
            let localResult = await FileManager._retrieveData("libs");
            if (localResult) {
                localResult = JSON.parse(localResult);
            } else {
                localResult = [];
            }
            return {
                data: localResult,
                lastDocument: { local: true }
            };
        }

        Analytics.log("Reading from Database with filterOptions: " + JSON.stringify(filterOptions));

        let q = collection(db, collection_);

        let localResult = [];

        switch (filterOptions.category) {
            case "official":
                q = query(q, where("official", "==", true));
                break;
            case "all":
                // Do nothing
                break;
            case "myFavorites":
                // Boilerplate for "myFavorites" - You can add the functionality later.
                if (this.currentUserData.auth) { 
                    q = query(q, where("likesArray", "array-contains", this.currentUserData.auth.uid));
                }
                else console.log("NOT LOGGED IN");
                break;
            case "myContent":
                console.log("DOING MY CONTENT PATH");
                localResult = await FileManager._retrieveData("my_content");
                if (localResult) { 
                    localResult = JSON.parse(localResult).filter(item => item.playable === true);
                } else {
                    localResult = [];
                }
                if (lastVisibleDoc) localResult = [];
                if (this.currentUserData.auth) {
                    console.log("IT PRINTED THIS: " + this.currentUserData.auth.uid);
                    q = query(q, where("user", "==", this.currentUserData.auth.uid));
                } else {
                    q = query(q, where("user", "==", "not logged in"));
                }
                break;
            default:
                break;
        }

        // Filtering by "playable" field
        if (filterOptions.playable !== undefined) {
            if (filterOptions.playable) {
                q = query(q, where("playable", "==", filterOptions.playable));
            } else {
                console.log("SHOW LOCAL READ!!!!!");
                if (lastVisibleDoc?.local) return;
                localResult = await FileManager._retrieveData("read");
                if (localResult) { 
                    localResult = JSON.parse(localResult).filter(item => item.playable === false);
                } else {
                    localResult = [];
                }
                return {
                    data: localResult,
                    lastDocument: { local: true }
                }
                q = query(q, where("playable", "==", filterOptions.playable));
            }
        }

        // Filtering by "published" field
        if (filterOptions.published !== undefined) {
            q = query(q, where("published", "==", filterOptions.published));
        }

        // Filtering by document IDs
        if (filterOptions.docIds) {
            // Remove null values from filterOptions.docIds
            filterOptions.docIds = filterOptions.docIds.filter(id => id !== null);
            if (filterOptions.docIds.length > 0) {
                q = query(q, where("__name__", "in", filterOptions.docIds));
            }
        }

        // Date range calculations
        const now = new Date();
        let startDate;

        switch (filterOptions.dateRange) {
            case "today":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                break;
            case "thisWeek":
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                break;
            case "thisMonth":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "thisYear":
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            case "allTime":
            default:
                startDate = null;
                break;
        }

        if (startDate) {
            q = query(q, where("date", ">=", startDate));
            q = query(q, orderBy("date", "desc"));  // Ensure ordering by date first
        }

        // Adjusted sorting options
        if (filterOptions.sortBy) {
            switch (filterOptions.sortBy) {
                case "likes":
                    q = query(q, orderBy("likes", "desc"));
                    break;
                case "trending":
                    q = query(q, orderBy("likes", "desc"));
                    Analytics.log("Weighted sorting has been DISABLED\nSorting by Top instead")
                    break;
                case "newest":
                    if (!startDate) {  // Only add this if we haven't ordered by date already
                        q = query(q, orderBy("date", "desc"));
                    }
                    break;
                default:
                    break;
            }
        }

        // Pagination
        q = query(q, limit(pageSize));
        if (lastVisibleDoc) {
            q = query(q, startAfter(lastVisibleDoc));
        }

        let result = null;
        try {
            result = await getDocs(q);
        } catch (error) {
            Analytics.log("Database read error " + error);
            if (lastVisibleDoc?.local) return;
            let result = await FileManager._retrieveData("libs");
            result = JSON.parse(result);
            return {
                data: result,
                lastDocument: { local: true }
            }
        }

        Analytics.log("Read data from database");
        let resultArray = []
        result.forEach((doc) => {
            let documentData = doc.data();
            documentData.id = doc.id;  // Add the document ID to the data
            resultArray.push(documentData);
        });

        const lastDoc = result.docs[result.docs.length - 1];
        //return localResult.concat(resultArray);
        return {
            data: localResult.concat(resultArray),
            lastDocument: lastDoc
        };
    }

    /**
     * Updates values in a Firestore document.
     * 
     * @param {string} collection_ - The name of the Firestore collection containing the document.
     * @param {string} docId - The ID of the document to update.
     * @param {Object} updateData - An object containing the fields and their new values to update.
     * @param {Object} [arrayUpdates] - An object containing fields with arrays that you want to add values to.
     * 
     * @returns {Promise<void>} - Returns a promise that resolves when the update is complete.
     * 
     * @example
     * // Overwriting fields:
     * await FirebaseManager.UpdateDocument("yourCollectionName", "yourDocumentId", { official: true, likes: 10 });
     * 
     * // Adding to an array field:
     * await FirebaseManager.UpdateDocument("yourCollectionName", "yourDocumentId", {}, { tags: ["newTag"] });
     */
    static async UpdateDocument(collection_, docId, updateData = {}, arrayUpdates = {}, arrayRemove_ = {}) {
        Analytics.log(`Updating document ${docId} in collection ${collection_} with data: ${JSON.stringify(updateData)}`);
    
        const docRef = doc(db, collection_, docId);
    
        // Begin the update batch
        const batch = writeBatch(db);
    
        // Apply field overwrites
        if (Object.keys(updateData).length > 0) {
            batch.update(docRef, updateData);
        }
    
        // Apply array updates
        for (const [field, values] of Object.entries(arrayUpdates)) {
            if (Array.isArray(values)) {
                batch.update(docRef, {
                    [field]: arrayUnion(...values)
                });
            } else {
                Analytics.log(`Expected array for field ${field} in arrayUpdates, but got ${typeof values}. Skipping this update.`);
            }
        }
    
        // Apply array removals
        for (const [field, values] of Object.entries(arrayRemove_)) {
            if (Array.isArray(values)) {
                batch.update(docRef, {
                    [field]: arrayRemove(...values)
                });
            } else {
                Analytics.log(`Expected array for field ${field} in arrayRemove, but got ${typeof values}. Skipping this update.`);
            }
        }
    
        // Commit the batch
        try {
            await batch.commit();
            Analytics.log(`Document ${docId} updated successfully.`);
        } catch (error) {
            Analytics.log(`Error updating document ${docId}: ${error}`);
            throw error;
        }
    }   

    static async generateMockData(numAccounts, numPostsPerAccount) {
        for (let i = 0; i < numAccounts; i++) {
            const mockEmail = `mockUser${i}@example.com`;
            const mockPassword = `123456`;

            // Create mock account
            await this.CreateUserWithEmailAndPassword(mockEmail, mockPassword);

            // Create mock posts for the account
            for (let j = 0; j < numPostsPerAccount; j++) {
                const mockPostData = this._generateMockPostData();
                await this.AddDocumentToCollection("posts", mockPostData); // Assuming "posts" is the collection name for posts
            }
        }
    }

    static _generateMockPostData() {
        // Generate random data for a mock post
        // This is just a basic example, you can expand this to fit your data model
        return {
            title: `Mock Post ${Math.random().toString(36).substr(2, 5)}`,
            content: `This is a mock post content ${Math.random().toString(36).substr(2, 10)}`,
            likes: Math.floor(Math.random() * 100),
            date: new Date(),
            official: Math.random() > 0.5
        };
    }

    static avatars = {
        0: require('../assets/images/avatars/0.png'),
        1: require('../assets/images/avatars/1.png'),
        2: require('../assets/images/avatars/2.png'),
        3: require('../assets/images/avatars/3.png'),
        4: require('../assets/images/avatars/4.png'),
        5: require('../assets/images/avatars/5.png'),
        6: require('../assets/images/avatars/6.png'),
        7: require('../assets/images/avatars/7.png'),
        8: require('../assets/images/avatars/8.png'),
        9: require('../assets/images/avatars/9.png'),
        10: require('../assets/images/avatars/10.png'),
        11: require('../assets/images/avatars/11.png'),
        12: require('../assets/images/avatars/12.png'),
        13: require('../assets/images/avatars/13.png'),
        14: require('../assets/images/avatars/14.png'),
        15: require('../assets/images/avatars/15.png'),
        16: require('../assets/images/avatars/16.png'),
        17: require('../assets/images/avatars/17.png'),
        18: require('../assets/images/avatars/18.png'),
        19: require('../assets/images/avatars/19.png'),
        20: require('../assets/images/avatars/20.png'),
        21: require('../assets/images/avatars/21.png'),
        22: require('../assets/images/avatars/22.png'),
        23: require('../assets/images/avatars/23.png'),
        24: require('../assets/images/avatars/24.png'),
        25: require('../assets/images/avatars/25.png'),
        26: require('../assets/images/avatars/26.png'),
        27: require('../assets/images/avatars/27.png'),
        28: require('../assets/images/avatars/28.png'),
        29: require('../assets/images/avatars/29.png'),
        "carousel-padding": require(`../assets/images/avatars/carousel-padding.png`),
        "no-avatar": require(`../assets/images/avatars/no-avatar.png`),
    }
}

// Sets auth state listener
FirebaseManager.OnAuthStateChanged();

//FirebaseManager.generateMockData(5, 5);
//FirebaseManager.ReadDataFromDatabase("posts");
//FirebaseManager.SignInWithEmailAndPassword("official@funlibs.com", "123456");
//FirebaseManager.SignOut();

//FirebaseManager.CreateUser("email", "official@funlibs.com", "123456", "Official", "13");

