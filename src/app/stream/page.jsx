// DashboardStream.jsx
"use client";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";

export default function DashboardStream() {
  const email = "iphery@gmail.com";
  const [status, setStatus] = useState({ update: false, update_at: null });

  useEffect(() => {
    if (!email) return;

    const unsubscribe = onSnapshot(
      doc(db, "dashboard", email),
      (doc) => {
        if (doc.exists()) {
          const data = doc.data();

          setStatus({
            update: data.update || false,
            update_at: data.update_at?.toDate() || null,
          });
        }
      },
      (error) => console.error("Error:", error),
    );

    return () => unsubscribe();
  }, [email]);

  return (
    <div>
      <h3>Status for {email}</h3>
      <div>Update Status: {status.update ? "Updated" : "Not Updated"}</div>
      {status.update_at && (
        <div>Last Updated: {status.update_at.toLocaleString()}</div>
      )}
    </div>
  );
}
