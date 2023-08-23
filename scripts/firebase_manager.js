import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, limit } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
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
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in, see docs for a list of available properties
                // https://firebase.google.com/docs/reference/js/auth.user
                const uid = user.uid;
                Analytics.log("Auth stated changed to Signed in for " + uid);
            } else {
                // User is signed out
                const uid = user.uid;
                Analytics.log("Auth stated changed to Signed out for " + uid);
            }
        });
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
            sortBy: "newest"
        },
        lastVisibleDoc = null,
        pageSize = 10
    ) {
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
                    q = query(q, orderBy("weighted_likes", "desc"));
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

        const result = await getDocs(q);

        Analytics.log("Read data from database");
        result.forEach((doc) => {
            Analytics.log(`${doc.id} => ${doc.data()}`);
        });

        const lastDoc = result.docs[result.docs.length - 1];
        return lastDoc;
    }
}

