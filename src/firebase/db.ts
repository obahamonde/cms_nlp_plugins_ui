import { collection, getDocs, getFirestore, orderBy, query, addDoc, deleteDoc, where, DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import { ref, Ref } from 'vue';
import { User } from "firebase/auth";


interface FirestoreDocument<T> extends DocumentData {
  id?: string;
  createdAt?: number;
}


function mapDocToData<T>(doc: QueryDocumentSnapshot<DocumentData>): FirestoreDocument<T> {
  const data = doc.data();
  const createdAt = typeof data.createdAt === 'number' ? data.createdAt : Date.now();
  return { ...data, createdAt } as FirestoreDocument<T>;
}

export const useFirestore = <T extends { id?: string }>(collectionName: string) => {
  const db = getFirestore();
  const col = collection(db, collectionName);
  const docs: Ref<FirestoreDocument<T>[]> = ref([]);

  const get = async (user: User | null) => {
    if (!user) return;
    const q = query(col, orderBy("createdAt", "desc"), where("user.id", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "added") {
        docs.value.push(mapDocToData<T>(change.doc));
      }
    } );
  };

  const set = async (data: T, user: User | null) => {
    if (!user) throw new Error("User is not authenticated");
    const { uid, displayName, photoURL } = user;
    await addDoc(col, {
      ...data,
      user: { id: uid, name: displayName, photoURL },
      createdAt: Date.now(),
    });
  };
 
  const del = async (id: string) => {
    const q = query(col, where("id", "==", id));
    const querySnapshot = await getDocs(q);
    const deleteOps = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deleteOps);
    docs.value = docs.value.filter((doc) => doc.id !== id);
    querySnapshot.docChanges().forEach((change) => {
      if (change.type === "removed") {
        docs.value = docs.value.filter((doc) => doc.id !== change.doc.id);
      }
    });
  }
  return [set, get, del, docs] as const;
}

