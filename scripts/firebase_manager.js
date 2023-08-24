import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit, doc, writeBatch, arrayUnion, deleteDoc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updatePassword, deleteUser  } from "firebase/auth";
import Analytics from './analytics';

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
    static currentUserData = null;

    static CreateUserWithEmailAndPassword(email, password) {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                Analytics.log("Created user " + JSON.stringify(user.uid));
            })
            .catch((error) => {
                Analytics.log("Error creating user " + JSON.stringify(error.message));
            });
    }

    static SignInWithEmailAndPassword(email, password) {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                Analytics.log("Signed in as " + JSON.stringify(user.uid));
            })
            .catch((error) => {
                const errorMessage = error.message;
                Analytics.log("Error signing in " + errorMessage);
            });
    }

    static OnAuthStateChanged() {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                const uid = user.uid;
                Analytics.log("Auth stated changed to Signed in for " + uid);

                // Fetch user data from Firestore and store in currentUserData
                await this.fetchUserData(uid);
            } else {
                // User is signed out
                this.currentUserData = null; // Reset the field to null
                Analytics.log("Auth stated changed to Signed out");
            }
        });
    }

    static async fetchUserData() {
        let uid = null;
        if (this.currentUesrData.auth) uid = this.currentUserData.auth.uid;
        try {
            const userDoc = await getDocs(doc(db, "users", uid)); // Assuming "users" is the collection name where user data is stored
            if (userDoc.exists()) {
                this.currentUserData = {
                    auth: auth.currentUser, // Store the auth user
                    firestoreData: userDoc.data() // Store the user's Firestore data
                };
            } else {
                // Handle the case where the user does not have a Firestore document
                this.currentUserData = {
                    auth: auth.currentUser,
                    firestoreData: null
                };
            }
        } catch (error) {
            Analytics.log("Error fetching user data: " + error);
            this.currentUserData = null; // Reset the field to null in case of an error
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

    static async AddDocumentToCollection(collection_, data) {
        try {
            const docRef = await addDoc(collection(db, collection_), data);
            Analytics.log("Added document to " + collection_ + "\nData: " + JSON.stringify(data));
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
     * @param {firebase.firestore.DocumentSnapshot} [lastVisibleDoc=null] - The last document from the previous query, used for pagination.
     * @param {number} [pageSize=10] - The number of documents to retrieve in a single query (pagination size).
     * 
     * @returns {Promise<firebase.firestore.DocumentSnapshot>} - Returns a promise that resolves to the last document in the current page of results. This can be used for subsequent paginated queries.
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
            official: true,
            docIds: undefined,
            sortBy: "newest",
            dateRange: undefined
        },
        lastVisibleDoc = null,
        pageSize = 10
    ) {
        Analytics.log("Reading from Database with filterOptions: " + JSON.stringify(filterOptions));

        let q = collection(db, collection_);

        // Filtering by "official" field
        if (filterOptions.official !== undefined) {
            if (filterOptions.official) {
                q = query(q, where("official", "==", true));
            } else {
                q = query(q, where("official", "in", [false, null]));
            }
        }

        // Filtering by document IDs
        if (filterOptions.docIds && filterOptions.docIds.length > 0) {
            q = query(q, where(firebase.firestore.FieldPath.documentId(), "in", filterOptions.docIds));
        }

        // Sorting options
        if (filterOptions.sortBy) {
            switch (filterOptions.sortBy) {
                case "likes":
                    q = query(q, orderBy("likes", "desc"));
                    break;
                case "trending":
                    //q = query(q, orderBy("weighted_likes", "desc"));
                    q = query(q, orderBy("likes", "desc"));
                    Analytics.log("Weighted sorting has been DISABLED\nSorting by Top instead")
                    break;
                case "newest":
                    q = query(q, orderBy("date", "desc"));
                    break;
                default:
                    break;
            }
        }

        // Date range options
        const currentDate = new Date();
        if (filterOptions.dateRange) {
            switch (filterOptions.dateRange) {
                case "today":
                    const startOfDay = new Date(currentDate);
                    startOfDay.setHours(0, 0, 0, 0);
                    q = query(q, where("date", ">=", startOfDay));
                    break;
                case "thisWeek":
                    const startOfWeek = new Date(currentDate);
                    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
                    q = query(q, where("date", ">=", startOfWeek));
                    break;
                case "thisMonth":
                    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                    q = query(q, where("date", ">=", startOfMonth));
                    break;
                case "thisYear":
                    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
                    q = query(q, where("date", ">=", startOfYear));
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
            return null;
        }

        Analytics.log("Read data from database");
        result.forEach((doc) => {
            Analytics.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        });

        const lastDoc = result.docs[result.docs.length - 1];
        return lastDoc;
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
    static async UpdateDocument(collection_, docId, updateData = {}, arrayUpdates = {}) {
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
                Analytics.log(`Expected array for field ${field}, but got ${typeof values}. Skipping this update.`);
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
}

//FirebaseManager.generateMockData(5, 5);
//FirebaseManager.ReadDataFromDatabase("posts");

