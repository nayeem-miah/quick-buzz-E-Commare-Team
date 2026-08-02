import { useQuery } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { FiSearch, FiUsers } from 'react-icons/fi';
import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import DeleteConfirmModal from '../../../Shared/DeleteConfirmModal';
import CustomDropdown from '../../../Shared/Dropdown/CustomDropdown';
import LoadingSpinner from '../../../Shared/Loading';
import Pagination from '../../../Shared/Pagination/Pagination';

import { User } from '../../../types/user';
import { ManageUsersCards } from './components/ManageUsersCards';
import { ManageUsersTable } from './components/ManageUsersTable';

const ROLES = ['All', 'User', 'Host', 'Admin'];
const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'host', label: 'Host' },
  { value: 'admin', label: 'Admin' },
];

const getAvatarColor = (name: string) => {
  const colors = [
    'from-orange-100 to-orange-50 text-orange-600 border-orange-200/60',
    'from-amber-100 to-amber-50 text-amber-700 border-amber-200/60',
    'from-stone-100 to-orange-50 text-stone-700 border-stone-200/70',
    'from-zinc-100 to-white text-zinc-700 border-zinc-200/70',
    'from-rose-100 to-orange-50 text-rose-600 border-rose-200/60',
    'from-yellow-100 to-amber-50 text-yellow-700 border-yellow-200/60',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getDropdownColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin':
      return 'bg-orange-50/80 text-orange-600 border-orange-200 focus:ring-orange-200/70';
    case 'host':
      return 'bg-amber-50/80 text-amber-700 border-amber-200 focus:ring-amber-200/70';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200 focus:ring-orange-200/60';
  }
};

const ManageUsers: React.FC = () => {
  const axiosSecure = UseAxiosSecure();
  const {
    data: users = [],
    refetch,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data.data;
    },
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [suspendTarget, setSuspendTarget] = useState<User | null>(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const size = 10;

  const handleRoleChange = async (user: User, newRole: string) => {
    const currentRole = user.role || 'user';

    if (currentRole.toLowerCase() === newRole.toLowerCase()) return;

    try {
      const res = await axiosSecure.patch(`/users/role/${user._id}`, {
        role: newRole,
      });
      if (res?.data?.data?.modifiedCount > 0) {
        await refetch();
        toast.success(`${user.name} is now a ${newRole}`);
      } else {
        toast.error(`No role change was made for ${user.name}.`);
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to update ${user.name}'s role`);
    }
  };

  const handleToggleSuspend = (user: User) => {
    setSuspendTarget(user);
  };

  const confirmToggleSuspend = async () => {
    if (!suspendTarget) return;

    const isCurrentlySuspended = suspendTarget.status === 'suspended';
    const newStatus = isCurrentlySuspended ? 'active' : 'suspended';

    setIsStatusUpdating(true);
    try {
      const res = await axiosSecure.patch(
        `/users/status/${suspendTarget._id}`,
        { status: newStatus },
      );
      if (res?.data?.data?.modifiedCount > 0) {
        await refetch();
        toast.success(
          `${suspendTarget.name} has been ${newStatus === 'suspended' ? 'suspended' : 'activated'}.`,
        );
        setSuspendTarget(null);
      } else {
        toast.error('No status change was made.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update status.');
    } finally {
      setIsStatusUpdating(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const userRole = (user.role || 'user').toLowerCase();
      const normalizedRole = userRole === 'customer' ? 'user' : userRole;

      let matchesRole = true;
      if (roleFilter !== 'All') {
        matchesRole = normalizedRole === roleFilter.toLowerCase();
      }

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, roleFilter]);

  const totalPages = Math.ceil(filteredUsers.length / size) || 1;
  const paginatedUsers = filteredUsers.slice((page - 1) * size, page * size);

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="w-full px-4 md:px-8 py-8 space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Manage Users
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Minimalist view, filter and manage all users.
          </p>
        </div>
      </div>

      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex w-full md:w-96 gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400 text-base" />
              </div>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2 bg-gray-50/50 border border-gray-200/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all focus:bg-white"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto z-30">
            <CustomDropdown
              value={roleFilter}
              onChange={(val) => setRoleFilter(val)}
              options={ROLES.map((r) => ({
                value: r,
                label: r === 'All' ? 'All Roles' : r,
              }))}
              className="w-full md:w-40"
              buttonClassName="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-xl px-4 py-2 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 cursor-pointer transition-all shadow-sm"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
              <FiUsers className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              No users found
            </h3>
            <p className="text-sm text-gray-500 max-w-sm">
              We couldn't find any users matching your criteria.
            </p>
            {(searchQuery || roleFilter !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setRoleFilter('All');
                }}
                className="mt-5 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <ManageUsersTable
              users={paginatedUsers}
              onRoleChange={handleRoleChange}
              onToggleSuspend={handleToggleSuspend}
              getAvatarColor={getAvatarColor}
              getDropdownColor={getDropdownColor}
              roleOptions={ROLE_OPTIONS}
            />

            <ManageUsersCards
              users={paginatedUsers}
              onRoleChange={handleRoleChange}
              onToggleSuspend={handleToggleSuspend}
              getAvatarColor={getAvatarColor}
              getDropdownColor={getDropdownColor}
              roleOptions={ROLE_OPTIONS}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              setPage={setPage}
              size={size}
              totalItems={filteredUsers.length}
            />
          </>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!suspendTarget}
        title={
          suspendTarget?.status === 'suspended'
            ? 'Activate user?'
            : 'Suspend user?'
        }
        message={
          suspendTarget?.status === 'suspended'
            ? 'This user will be able to access their account again.'
            : 'This user will lose access until you activate the account.'
        }
        itemName={
          suspendTarget
            ? `${suspendTarget.name} (${suspendTarget.email})`
            : undefined
        }
        isDeleting={isStatusUpdating}
        confirmText={suspendTarget?.status === 'suspended' ? 'Activate' : 'Suspend'}
        loadingText={suspendTarget?.status === 'suspended' ? 'Activating...' : 'Suspending...'}
        onClose={() => setSuspendTarget(null)}
        onConfirm={confirmToggleSuspend}
      />
    </div>
  );
};

export default ManageUsers;
