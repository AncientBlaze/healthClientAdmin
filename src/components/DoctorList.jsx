import React, { useEffect, useState } from 'react';
import axios from "../utils/axios";

function DoctorList() {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/doctors')
      .then(res => setDoctors(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Doctors</h2>
      <ul className="list-disc pl-8">
        {doctors.map(doc => (
          <li key={doc._id} className="flex items-center gap-2">
            <span className="font-semibold">{doc.name}</span>
            <span className="text-sm font-light">{doc.specialty}</span>
            <span className="text-sm">{doc.available ? 'Available' : 'Unavailable'}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DoctorList;
