'use client';
import SubsTableItem from '@/Components/AdminComponent/SubsTableItem';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Page = () => {
  const [emails, setEmails] = useState([]);

  const fetchEmails = async () => {
    try {
      const res = await axios.get('/api/email');

      if (res.status === 200) {
        setEmails(res.data.emails);
      } else {
        // 404 에러 처리
        setEmails([]); // 빈 배열로 설정
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      setEmails([]); // 빈 배열로 설정
    }
  };

  const deleteEmail = async (mongoId) => {
    const res = await axios.delete('/api/email', {
      params: { id: mongoId },
    });

    toast.success(res.data.msg);
    fetchEmails();
  };

  useEffect(() => {
    fetchEmails();
  }, []);
  console.log('emails:', emails);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1>All Subscriptions</h1>
      <div className="relative max-w-[600px] h-[80vh] overflow-x-auto mt-4 border border-color-gray-400 scrollbar-hide">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-left text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Email Subscription
              </th>
              <th scope="col" className="hidden sm:block px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {emails.map((item, index) => {
              return (
                <SubsTableItem
                  key={index}
                  mongoId={item._id}
                  email={item.email}
                  date={item.date}
                  deleteEmail={deleteEmail}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
