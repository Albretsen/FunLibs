import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDoc, getDocs, query, where, orderBy, limit, doc, writeBatch, arrayUnion, arrayRemove, deleteDoc, setDoc, startAfter, runTransaction, Timestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updatePassword, deleteUser, browserLocalPersistence, signOut, setPersistence, sendPasswordResetEmail, updateProfile, signInWithCustomToken } from "firebase/auth";
import Analytics from './analytics';
import FileManager from './file_manager';
import { Platform } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import LibManager from './lib_manager';

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
    static auth = auth;

    static currentUserData = {
        auth: null,
        firestoreData: null
    };

    static storeAuthData(user) {
        const authData = {
            auth: user,
            firestoreData: {
                username: user.displayName,
                email: user.email,
                avatarID: user.photoURL,
                uid: user.uid,
            }
        };
        FileManager._storeData("authData", JSON.stringify(authData));
    }

    static async getStoredAuthData() {
        const data = await FileManager._retrieveData("authData");
        return data ? JSON.parse(data) : null;
    }

    static setAuthData(data) {
        this.currentUserData.auth = data.auth;
        this.currentUserData.firestoreData = data.firestoreData;
    }

    // This method can be called upon app initialization to set the user's auth data if they're "logged in"
    static async initializeAuthState() {
        const authData = await this.getStoredAuthData();
        if (authData) {
            this.setAuthData(authData);
            //this.fetchUserData();
        }
    }

    // Call this method to clear the auth state, simulating a logout
    static logout() {
        FileManager._storeData("authData", "");
        this.currentUserData = { auth: null, firestoreData: null };
    }

    static getCurrentUserData() {
        return this.currentUserData;
    }

    static CreateUserWithEmailAndPassword(email, password) {
        return new Promise((resolve, reject) => {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    this.currentUserData.auth = user;
                    Analytics.log("Created user " + JSON.stringify(user.uid));
                    resolve(user); // Resolve the promise with the user object
                })
                .catch((error) => {
                    Analytics.log("Error creating user " + JSON.stringify(error.message));
                    console.log("EXTRA LOG: " + JSON.stringify(error));
                    reject(error); // Reject the promise with the error message
                });
        });
    }

    static async CreateUser(signUpMethod, email, password, username, avatarID) {
        return new Promise(async (resolve, reject) => {
            try {
                switch (signUpMethod) {
                    case "email":
                        const user = await this.CreateUserWithEmailAndPassword(email, password);
                        await this.UpdateUserAuthProfile({
                            displayName: username,
                            photoURL: avatarID
                        }, user);
                        await this.fetchUserData();
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

    static getCreateAccountErrorMessage(errorCode) {
        const errorMessages = {
            'auth/email-already-in-use': 'The email address is already in use by another account.',
            'auth/invalid-email': 'The email address is not valid.',
            'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
            'auth/weak-password': 'The password is too weak.',
            'auth/missing-password': 'Please add a password',
            // Add more error codes and their messages as needed
        };
    
        return errorMessages[errorCode] || 'An unknown error occurred.';
    }

    static SignInWithEmailAndPassword(email, password) {
        return new Promise((resolve, reject) => {
            FirebaseManager.SetAuthPersistenceToLocal();
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    this.currentUserData.auth = user;
                    this.storeAuthData(user);
                    Analytics.log("Signed in as " + JSON.stringify(user.uid));
                    resolve(user); // or resolve('Signed in successfully')
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    Analytics.log("Error signing in " + errorMessage);
                    reject(error);  // Reject promise with error message
                });
        });
    }

    static getAuthErrorMessage(errorCode) {
        const errorMessages = {
            'auth/wrong-password': 'The password is incorrect.',
            'auth/user-not-found': 'No account found with this email address.',
            'auth/user-disabled': 'This account has been disabled.',
            'auth/invalid-email': 'The email address is not valid.',
            'auth/operation-not-allowed': 'Sign-in with email and password is not enabled.',
            'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
            'auth/missing-password': 'Missing password.'
            // ... add other error codes as needed
        };
    
        return errorMessages[errorCode] || 'An unknown error occurred.';
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
                FileManager._storeData("uid", uid);
                this.localUID = uid;
                this.storeAuthData(user);

                // Fetch user data from Firestore and store in currentUserData
                await this.fetchUserData(uid);
                this.RefreshList(user);
                Analytics.log("Auth stated changed to Signed in for " + uid);
            } else {
                // User is signed out
                this.currentUserData = { auth: null, firestoreData: null }; // Reset the field to null
                this.localUID = "";
                await FileManager._storeData("uid", "");
                this.RefreshList(null);
                Analytics.log("Auth stated changed to Signed out");
            }
        });
    }

    static async fetchUserData() {
        console.log("FETCHING USER DATA");
        let uid = null;
        if (this.currentUserData.auth) {
            uid = this.currentUserData.auth.uid;
        }
        this.currentUserData = {
            auth: auth.currentUser,
            firestoreData: {
                email:"",
                username:"",
                avatarID:"",
            }
        };
        this.currentUserData.firestoreData.email = this.currentUserData.auth.email;
        this.currentUserData.firestoreData.username = this.currentUserData.auth.displayName;
        this.currentUserData.firestoreData.avatarID = this.currentUserData.auth.photoURL;

        console.log("DATA: " + JSON.stringify(this.currentUserData));
        /*try {
            if (uid) {
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
        }*/
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

    static UpdateUserAuthProfile(profileData, user) {
        let uid = user.uid;
        return new Promise((resolve, reject) => {
            if (!user) {
                const error = new Error('User not found');
                Analytics.log("Error updating profile " + error.message);
                reject(error);
                return;
            }

            updateProfile(user, profileData)
                .then(() => {
                    Analytics.log("Updated profile for " + uid);
                    this.currentUserData.auth = auth.user;
                    this.RefreshList(null);
                    resolve('Profile updated successfully');
                })
                .catch((error) => {
                    this.RefreshList(null);
                    Analytics.log("Error updating profile " + error.message);
                });
        });
    }

    static async sendPasswordResetEmail(email) {
        if (!email) {
            email = FirebaseManager.currentUserData?.auth?.email;
        }
        try {
            await sendPasswordResetEmail(auth, email);
            Analytics.log(`Password reset email sent to ${email}`);
        } catch (error) {
            Analytics.log(`Error sending password reset email: ${error.message}`);
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
            FirebaseManager.logout();
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
            const userDocRef = doc(db, "users", uid);
            await deleteDoc(userDocRef);
            Analytics.log(`Deleted user data from Firestore for UID: ${uid}`);
        } catch (error) {
            Analytics.log(`Error deleting user data from Firestore: ${error.message}`);
            throw error;
        }
    
        // 2. Paginate through and delete all posts associated with the user
        let lastVisible;
        const batchSize = 10;  // Adjust this based on your needs
    
        do {
            let userPostsQuery = query(collection(db, "posts"), where("user", "==", uid), orderBy("date"), limit(batchSize));
    
            if (lastVisible) {
                userPostsQuery = query(collection(db, "posts"), where("user", "==", uid), orderBy("date"), startAfter(lastVisible), limit(batchSize));
            }
    
            const snapshot = await getDocs(userPostsQuery);
    
            if (snapshot.empty) {
                break;
            }
    
            lastVisible = snapshot.docs[snapshot.docs.length - 1];
    
            const batch = writeBatch(db);
    
            snapshot.docs.forEach(doc => {
                batch.delete(doc.ref);
            });
    
            await batch.commit();
    
        } while (true);
    
        Analytics.log(`Deleted all posts associated with UID: ${uid}`);
    
        // 3. Delete the Firebase Auth user
        try {
            await deleteUser(user);
            FirebaseManager.logout();
            Analytics.log(`Deleted Firebase Auth user with UID: ${uid}`);
        } catch (error) {
            Analytics.log(`Error deleting Firebase Auth user: ${error.message}`);
            throw error;
        }
    }

    static async AddDocumentToCollection(collection_, data, id = null) {
        Analytics.increment("database_writes");
        try {
            if (id) {
                await setDoc(doc(db, collection_, id), data);
            } else {
                const docRef = await addDoc(collection(db, collection_), data);
                id = docRef.id;
            }
            Analytics.log("Added document to " + collection_ + "\nData: " + JSON.stringify(data));
            if (collection_ === "posts") {
                this.RefreshList(null);
            }
            return id;
        } catch (error) {
            Analytics.log("Error adding document to " + collection_ + "\nError: " + error);
        }
    }

    /**
     * Updates the likes of a post atomically using a Firestore transaction.
     * 
     * @param {string} postId - The ID of the post to update.
     * @param {string} userUid - The UID of the user liking/unliking the post.
     * 
     * @returns {Promise<void>} - Returns a promise that resolves when the update is complete.
     */
    static async updateLikesWithTransaction(postId, userUid) {
        Analytics.increment("database_updates");
        const postRef = doc(db, "posts", postId);
    
        return runTransaction(db, async (transaction) => {
            const postSnapshot = await transaction.get(postRef);
            
            if (!postSnapshot.exists()) {
                throw new Error(`Document with ID ${postId} does not exist.`);
            }
    
            const currentLikesArray = postSnapshot.data().likesArray || [];
            let updatedLikesArray;
    
            if (currentLikesArray.includes(userUid)) {
                updatedLikesArray = currentLikesArray.filter(uid => uid !== userUid);
            } else {
                updatedLikesArray = [...currentLikesArray, userUid];
            }
    
            transaction.update(postRef, {
                likesArray: updatedLikesArray,
                likes: updatedLikesArray.length
            });
        });
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
                } else {
                    q = query(q, where("likesArray", "array-contains", "NO_UID"));
                }
                break;
            case "myContent":
                localResult = await FileManager._retrieveData("my_content");
                if (localResult) { 
                    localResult = JSON.parse(localResult).filter(item => item.playable === true);
                } else {
                    localResult = [];
                }
                if (lastVisibleDoc) localResult = [];
                if (this.currentUserData?.auth) {
                    console.log("ADDING AUTH TAG: " + this.currentUserData.auth.uid);
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
                //if (lastVisibleDoc?.local) return;
                localResult = await FileManager._retrieveData("read");
                if (localResult) { 
                    localResult = JSON.parse(localResult);
                } else {
                    localResult = [];
                }
                localResult.reverse();
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
                startDate = new Date(now.getFullYear()-10, 0, 1);
                break; // Leaving this comment here to note the historical significance of this break statement. I wasted hours debugging why the sort order wasn't working. The fix was adding this break statement. Who knows why my IDE wouldn't notify of a missing break statement though!!!!!!!!!
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
                    // Remove this condition since we're already ordering by date above
                    // if (!startDate) {  
                    //     q = query(q, orderBy("date", "desc"));
                    // }
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
            Analytics.increment("database_reads");
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
        if (Analytics.production === false) this.FindUnsupportedPrompts(localResult.concat(resultArray));
        //return localResult.concat(resultArray);
        return {
            data: localResult.concat(resultArray),
            lastDocument: lastDoc
        };
    }

    static FindUnsupportedPrompts(array) {
        try {
            array.forEach(lib => {
                lib.prompts.forEach(prompt => {
                    let promptFill = LibManager.getPromptFill(Object.keys(prompt)[0]);
                    let issues = "";
                    if (promptFill.length < 2) {
                        issues += " Missing fill.";
                    }
                    let promptExplanation = LibManager.getPromptExplanation(Object.keys(prompt)[0]);
                    if (promptExplanation.length < 2) {
                        issues += " Missing explanation.";
                    }
                    if (issues.length > 0) console.log(Object.keys(prompt)[0] + " | " + issues);
                });
            })
        } catch (err) {
            console.log(err);
        }
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
        Analytics.increment("database_updates");
        
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
    
    static async DeleteDocument(collection_, docId) {
        Analytics.increment("database_deletes");
        try {
            const docRef = doc(db, collection_, docId);
            await deleteDoc(docRef);
            Analytics.log(`Deleted document with ID ${docId} from collection ${collection_}`);
        } catch (error) {
            Analytics.log(`Error deleting document with ID ${docId}: ${error}`);
            throw error; // Re-throw the error so it can be caught and handled by the caller
        }
        /*if (collection_ === "posts") {
            this.RefreshList(null);
        }*/
    }

    static async RefreshList(filterOptions) {
        this.authStateListeners.forEach(listener => listener(filterOptions));
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

    static async convertDateStringsToTimestamps() {
        // Get all documents from the 'posts' collection
        const postsCollectionRef = collection(db, 'posts');
        const snapshot = await getDocs(postsCollectionRef);
    
        // Iterate through each document
        for (const docSnap of snapshot.docs) {
            const now = new Date();
            const start = new Date(now);
            start.setMonth(now.getMonth() - 2);
            const randomDate = new Date(start.getTime() + Math.random() * (now.getTime() - start.getTime()));
    
            // Convert the random date to a Firestore Timestamp
            const timestamp = Timestamp.fromDate(randomDate);
    
            // Update the 'date' field of the document with the new Timestamp
            const docRef = doc(postsCollectionRef, docSnap.id);
            await this.UpdateDocument('posts', docSnap.id, { date: timestamp });
        }
    
        console.log('Date conversion completed.');
    }

    static setLocalUID = async () => {
        this.localUID = await FileManager._retrieveData("uid");
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
        "no-avatar-48": require(`../assets/images/avatars/no-avatar-48.png`),
        "no-avatar-24": require(`../assets/images/avatars/no-avatar-24.png`),
    }
}

// Sets auth state listener
FirebaseManager.initializeAuthState();
FirebaseManager.setLocalUID();
FirebaseManager.OnAuthStateChanged();
//FirebaseManager.convertDateStringsToTimestamps();

//FirebaseManager.generateMockData(5, 5);
//FirebaseManager.ReadDataFromDatabase("posts");
//FirebaseManager.SignInWithEmailAndPassword("official@funlibs.com", "123456");
//FirebaseManager.SignOut();

//FirebaseManager.CreateUser("email", "official@funlibs.com", "123456", "Official", "13");

