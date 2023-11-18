import { collection, getDocs, getFirestore, orderBy, query, addDoc, deleteDoc, where, onSnapshot, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { ref, Ref } from 'vue';
import { User } from "firebase/auth";

interface FirestoreDocument<T> extends DocumentData {
  id: string;
}

function mapDocToData<T>(doc: QueryDocumentSnapshot<DocumentData>): FirestoreDocument<T> {
  const data = doc.data();
  const createdAt = typeof data.createdAt === 'number' ? data.createdAt : Date.now();
  return { ...data, id: doc.id, createdAt } as FirestoreDocument<T>;
}

export const useFirestore = <T extends { id?: string }>(collectionName: string) => {
  const db = getFirestore();
  const col = collection(db, collectionName);
  const docs: Ref<FirestoreDocument<T>[]> = ref([]);

  const get = (user: User) => {
    const q = query(col, orderBy("created_at", "desc"), where("user.id", "==", user.uid));
    onSnapshot(q, (querySnapshot) => {
      docs.value = querySnapshot.docs.map(mapDocToData);
    });

  }


  const set = async (data: T, user: User) => {
    const { uid, displayName, photoURL } = user;
    await addDoc(col, {
      ...data,
      user: { id: uid, name: displayName, photoURL }
    });
  }

  const del = async (id: string, user: User) => {
    const q = query(col, orderBy("created_at", "desc"), where("user.id", "==", user.uid));
    const snapshot = await getDocs(q);
    snapshot.forEach(doc => {
      if (doc.id === id) {
        deleteDoc(doc.ref).then(() => {
          return;
        }).catch((error) => {
          console.error("Error removing document: ", error);
        }
        );
      }
    });
  }

  watchEffect((onInvalidate) => {
    const unsubscribe = onSnapshot(col, (querySnapshot) => {
      docs.value = querySnapshot.docs.map(mapDocToData);
    });
    onInvalidate(() => unsubscribe());
  }   
  );


  return [set, get, del, docs] as const;
};
