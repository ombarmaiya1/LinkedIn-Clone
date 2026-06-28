import { useCallback, useContext, useEffect, useState } from "react";
import Navbar from "../components/navbar/Navbar";
import api from "../utils/api";
import { UserDataContext } from "../context/UserContext";
import socket from "../utils/socket";

const UserTile = ({ user, children }) => {
  if (!user) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={user.profileImage || ""}
          alt={`${user.firstName || ""} ${user.lastName || ""}`}
          className="h-14 w-14 rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-600 truncate">
            {user.headline || "No headline"}
          </p>
          <p className="text-xs text-gray-500 truncate">@{user.userName}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </div>
  );
};

const SectionCard = ({ title, count, children }) => (
  <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      <span className="text-sm font-medium text-gray-500">{count}</span>
    </div>
    <div className="space-y-3">{children}</div>
  </section>
);

const NetworkPage = () => {
  const { refreshUserData } = useContext(UserDataContext);
  const [overview, setOverview] = useState({
    suggestions: [],
    incomingRequests: [],
    outgoingRequests: [],
    connections: [],
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOverview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/network/overview");
      setOverview(response.data?.data || {});
    } catch (error) {
      console.error("Failed to fetch network overview", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  useEffect(() => {
    const handleNetworkUpdate = () => {
      fetchOverview();
    };

    socket.on("network:updated", handleNetworkUpdate);

    return () => {
      socket.off("network:updated", handleNetworkUpdate);
    };
  }, [fetchOverview]);

  const runAction = async (handler) => {
    try {
      setActionLoading(true);
      await handler();
      await Promise.all([fetchOverview(), refreshUserData?.()]);
    } catch (error) {
      console.error("Network action failed", error);
    } finally {
      setActionLoading(false);
    }
  };

  const sendRequest = async (targetUserId) => {
    await runAction(() => api.post(`/network/request/${targetUserId}`));
  };

  const acceptRequest = async (requesterUserId) => {
    await runAction(() => api.post(`/network/accept/${requesterUserId}`));
  };

  const rejectRequest = async (requesterUserId) => {
    await runAction(() => api.post(`/network/reject/${requesterUserId}`));
  };

  const removeConnection = async (targetUserId) => {
    await runAction(() => api.delete(`/network/remove/${targetUserId}`));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#f3f2ef] py-6 pb-24 md:pb-6">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 md:px-6 lg:grid-cols-2">
          {loading ? (
            <div className="col-span-full rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow-sm">
              Loading your network...
            </div>
          ) : (
            <>
              <SectionCard
                title="Pending Invitations"
                count={overview.incomingRequests?.length || 0}
              >
                {overview.incomingRequests?.length ? (
                  overview.incomingRequests.map((user) => (
                    <UserTile user={user} key={user._id}>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => acceptRequest(user._id)}
                        className="rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => rejectRequest(user._id)}
                        className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                      >
                        Ignore
                      </button>
                    </UserTile>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No pending invitations.
                  </p>
                )}
              </SectionCard>

              <SectionCard
                title="People You May Know"
                count={overview.suggestions?.length || 0}
              >
                {overview.suggestions?.length ? (
                  overview.suggestions.map((user) => (
                    <UserTile user={user} key={user._id}>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => sendRequest(user._id)}
                        className="rounded-full border border-blue-600 px-4 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:opacity-60"
                      >
                        Connect
                      </button>
                    </UserTile>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    No suggestions right now. Check back later.
                  </p>
                )}
              </SectionCard>

              <SectionCard
                title="Your Connections"
                count={overview.connections?.length || 0}
              >
                {overview.connections?.length ? (
                  overview.connections.map((user) => (
                    <UserTile user={user} key={user._id}>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => removeConnection(user._id)}
                        className="rounded-full border border-red-300 px-4 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                      >
                        Remove
                      </button>
                    </UserTile>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">
                    You do not have any connections yet.
                  </p>
                )}
              </SectionCard>

              <SectionCard
                title="Sent Requests"
                count={overview.outgoingRequests?.length || 0}
              >
                {overview.outgoingRequests?.length ? (
                  overview.outgoingRequests.map((user) => (
                    <UserTile user={user} key={user._id}>
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => removeConnection(user._id)}
                        className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                      >
                        Cancel request
                      </button>
                    </UserTile>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No outgoing requests.</p>
                )}
              </SectionCard>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default NetworkPage;
