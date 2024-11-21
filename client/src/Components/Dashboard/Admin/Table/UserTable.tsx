import React from "react";

type TeamMember = {
  id: number;
  name: string;
  username: string;
  status: string;
  role: string;
  email: string;
  teams: string[];
  imgSrc: string;
};

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: "Arthur Melo",
    username: "@authurmelo",
    status: "Active",
    role: "Design Director",
    email: "authurmelo@example.com",
    teams: ["Design", "Product", "Marketing"],
    imgSrc:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
  },
  {
    id: 2,
    name: "Amelia Anderson",
    username: "@ameliaanderson",
    status: "Active",
    role: "Lead Developer",
    email: "ameliaanderson@example.com",
    teams: ["Design", "Product", "Marketing"],
    imgSrc:
      "https://images.unsplash.com/photo-1531590878845-12627191e687?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80",
  },
  {
    id: 3,
    name: "junior REIS",
    username: "@junior",
    status: "Active",
    role: "Products Manager",
    email: "junior@example.com",
    teams: ["Design", "Product", "Marketing"],
    imgSrc:
      "https://images.unsplash.com/photo-1608174386344-80898cec6beb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
  },
];

const UserTable: React.FC = () => {
  return (
    <section className="">
      <div className="flex items-center gap-x-3">
        <h2 className="text-lg font-medium">Team members</h2>
      </div>

      <div className="flex flex-col mt-6">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200  md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="">
                  <tr>
                    <th
                      scope="col"
                      className=" py-3.5 text-sm font-normal text-left rtl:text-right px-8"
                    >
                      <button className="flex items-center gap-x-2">
                        <span>user info</span>
                      </button>
                    </th>

                    <th
                      scope="col"
                      className=" py-3.5 text-sm font-normal text-left rtl:text-right px-8"
                    >
                      Email address
                    </th>

                    <th
                      scope="col"
                      className=" py-3.5 text-sm font-normal text-left rtl:text-right px-8"
                    >
                      role
                    </th>
                  </tr>
                </thead>

                <tbody className=" divide-y divide-gray-200 dark:divide-gray-700 ">
                  {teamMembers.map((member) => (
                    <tr key={member.id}>
                      <td className=" py-4 px-8 text-sm font-medium  whitespace-nowrap">
                        <div className="inline-flex items-center gap-x-3">
                          <div className="flex items-center gap-x-2">
                            <img
                              className="object-cover w-10 h-10 rounded-full"
                              src={member.imgSrc}
                              alt={member.name}
                            />
                            <div>
                              <h2 className="font-medium text-gray-800 dark:text-white">
                                {member.name}
                              </h2>
                              <p className="text-sm font-normal text-gray-600 dark:text-gray-400">
                                {member.username}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className=" py-4 px-8
                 text-sm   whitespace-nowrap"
                      >
                        {member.email}
                      </td>
                      <td className="py-4 px-8 text-sm whitespace-nowrap">
                        <select
                          className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500   dark:focus:ring-indigo-400"
                          defaultValue="User"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="host">Host</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserTable;
