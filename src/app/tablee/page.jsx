"use client";
import Header from "@/components/Header";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function Page() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const data = [
    {
      id: 1,
      name: "Product ABC",
      category: "Electronics",
      price: "$299.99",
      stock: 150,
      manufacturer: "TechCorp",
      SKU: "TECH-001",
      lastUpdated: "2024-01-15",
      status: "In Stock",
      description: "High-quality electronic device",
    },
    {
      id: 2,
      name: "Product XYZ",
      category: "Home Goods",
      price: "$49.99",
      stock: 75,
      manufacturer: "HomeCo",
      SKU: "HOME-002",
      lastUpdated: "2024-01-16",
      status: "Low Stock",
      description: "Essential home item",
    },
    {
      id: 3,
      name: "Product 123",
      category: "Office Supplies",
      price: "$12.99",
      stock: 200,
      manufacturer: "OfficeWorks",
      SKU: "OFF-003",
      lastUpdated: "2024-01-17",
      status: "In Stock",
      description: "Professional office equipment",
    },
  ];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
        <div>
          <div className="border-gray-200 overflow-x-auto rounded-sm border">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-gray-900 whitespace-nowrap border-b px-6 py-3 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="text-gray-900 whitespace-nowrap border-b px-6 py-3 text-left text-sm font-semibold">
                    Name
                  </th>
                  <th className="text-gray-900 whitespace-nowrap border-b px-6 py-3 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="text-gray-900 whitespace-nowrap border-b px-6 py-3 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="text-gray-900 whitespace-nowrap border-b px-6 py-3 text-left text-sm font-semibold">
                    Stock
                  </th>
                  <th className="text-gray-900 whitespace-nowrap border-b px-6 py-3 text-left text-sm font-semibold">
                    Manufacturer
                  </th>
                  <th className="text-gray-900 whitespace-nowrap border-b px-6 py-3 text-left text-sm font-semibold">
                    SKU
                  </th>
                  <th className="text-gray-900 whitespace-nowrap border-b px-6 py-3 text-left text-sm font-semibold">
                    Last Updated
                  </th>
                  <th className="text-gray-900 whitespace-nowrap border-b px-6 py-3 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="text-gray-900 whitespace-nowrap border-b px-6 py-3 text-left text-sm font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-gray-200 divide-y bg-white">
                {data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                      {item.id}
                    </td>
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                      {item.name}
                    </td>
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                      {item.category}
                    </td>
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                      {item.price}
                    </td>
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                      {item.stock}
                    </td>
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                      {item.manufacturer}
                    </td>
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                      {item.SKU}
                    </td>
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                      {item.lastUpdated}
                    </td>
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                      {item.status}
                    </td>
                    <td className="text-gray-900 whitespace-nowrap px-6 py-4 text-sm">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
