
type Activity = {
  id: number;
  title: string;
  category: string;
  date: string;
  score: number;
  status: "Completed" | "In Progress";
};

const activities: Activity[] = [
  {
    id: 1,
    title: "Handling an Angry Customer",
    category: "Customer Roleplay",
    date: "October 28, 2026",
    score: 92,
    status: "Completed",
  },
  {
    id: 2,
    title: "BPO Initial Interview",
    category: "AI Interview",
    date: "October 27, 2026",
    score: 88,
    status: "Completed",
  },
  {
    id: 3,
    title: "Technical Support Simulation",
    category: "Technical Support",
    date: "October 26, 2026",
    score: 0,
    status: "In Progress",
  },
];

export function RecentActivity() {
  return (
    <div
      id="history"
      className="card border border-base-300 bg-base-100 shadow-sm"
    >
      <div className="card-body gap-4 p-5">
        <div>
          <h3 className="text-lg font-bold">Recent Activity</h3>
          <p className="text-sm text-base-content/60">
            Your latest training sessions
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>Activity</th>
                <th>Date</th>
                <th>Score</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>
                    <div className="font-semibold">
                      {activity.title}
                    </div>
                    <div className="text-xs text-base-content/50">
                      {activity.category}
                    </div>
                  </td>

                  <td className="whitespace-nowrap text-sm">
                    {activity.date}
                  </td>

                  <td className="font-semibold">
                    {activity.status === "Completed"
                      ? `${activity.score}%`
                      : "—"}
                  </td>

                  <td>
                    <span
                      className={`badge badge-sm ${
                        activity.status === "Completed"
                          ? "badge-success"
                          : "badge-warning"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

