import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../constants/firebase';

export function useUserNameSync() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userDocRef = doc(db, 'users', 'defaultUser');

    const unsubscribe = onSnapshot(
      userDocRef,
      docSnap => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.name || '');
        } else {
          setUserName('');
        }
      },
      error => {
        console.error('Error syncing user name:', error);
        setUserName('');
      },
    );

    return () => unsubscribe();
  }, []);

  return userName;
}
