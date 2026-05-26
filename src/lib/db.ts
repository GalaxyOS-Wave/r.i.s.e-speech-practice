import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { UserProfile, Speech, PracticeSession } from '../types';

// User Profile DB Operations
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userDocRef);
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function createUserProfile(uid: string, email: string, name: string): Promise<UserProfile> {
  const path = `users/${uid}`;
  const newProfile: UserProfile = {
    id: uid,
    email: email || '',
    name: name || 'Orator User',
    xp: 0,
    level: 1,
    streak: 0,
    totalSpeechesCount: 0,
    totalPracticeDuration: 0,
    matchRate: 0,
    badges: [],
  };

  try {
    await setDoc(doc(db, 'users', uid), newProfile);
    return newProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function updateUserProfileInDb(uid: string, updates: Partial<UserProfile>): Promise<void> {
  const path = `users/${uid}`;
  try {
    await updateDoc(doc(db, 'users', uid), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Speeches DB Operations
export async function fetchUserSpeeches(uid: string): Promise<Speech[]> {
  const path = `users/${uid}/speeches`;
  try {
    const colRef = collection(db, 'users', uid, 'speeches');
    const q = query(colRef, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const result: Speech[] = [];
    querySnapshot.forEach((d) => {
      result.push(d.data() as Speech);
    });
    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

export async function addSpeechToDb(uid: string, speech: Speech): Promise<void> {
  const path = `users/${uid}/speeches/${speech.id}`;
  try {
    await setDoc(doc(db, 'users', uid, 'speeches', speech.id), speech);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function updateSpeechInDb(uid: string, speechId: string, updates: Partial<Speech>): Promise<void> {
  const path = `users/${uid}/speeches/${speechId}`;
  try {
    await updateDoc(doc(db, 'users', uid, 'speeches', speechId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

export async function deleteSpeechFromDb(uid: string, speechId: string): Promise<void> {
  const path = `users/${uid}/speeches/${speechId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'speeches', speechId));
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}

// Sessions DB Operations
export async function fetchUserSessions(uid: string): Promise<PracticeSession[]> {
  const path = `users/${uid}/sessions`;
  try {
    const colRef = collection(db, 'users', uid, 'sessions');
    const q = query(colRef, orderBy('completedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const result: PracticeSession[] = [];
    querySnapshot.forEach((d) => {
      result.push(d.data() as PracticeSession);
    });
    return result;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return [];
  }
}

export async function addSessionToDb(uid: string, session: PracticeSession): Promise<void> {
  const path = `users/${uid}/sessions/${session.id}`;
  try {
    await setDoc(doc(db, 'users', uid, 'sessions', session.id), session);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
    throw error;
  }
}
