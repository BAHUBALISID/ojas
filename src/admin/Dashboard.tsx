import { useEffect, useState } from 'react';
import { Award, FileText, TrendingUp, Users } from 'lucide-react';

interface Certificate {
  id: string;
  internName: string;
  domain: string;
  issueDate: string;
}

interface Invoice {
  id: string;
  clientName: string;
  amount: number;
  issueDate: string;
  status: 'paid' | 'pending' | 'overdue';
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCertificates: 0,
    totalInvoices: 0,
    totalRevenue: 0,
    pendingInvoices: 0,
  });
  const [recentCertificates, setRecentCertificates] = useState<Certificate[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    // Load data from localStorage
    const certificates = JSON.parse(localStorage.getItem('ojas_certificates') || '[]');
    const invoices = JSON.parse(localStorage.getItem('ojas_invoices') || '[]');

    setStats({
      totalCertificates: certificates.length,
      totalInvoices: invoices.length,
      totalRevenue: invoices.reduce((sum: number, inv: Invoice) => sum + inv.amount, 0),
      pendingInvoices: invoices.filter((inv: Invoice) => inv.status === 'pending').length,
    });

    setRecentCertificates(certificates.slice(-5).reverse());
    setRecentInvoices(invoices.slice(-5).reverse());
  }, []);

  const statCards = [
    {
      label: 'Total Certificates',
      value: stats.totalCertificates,
      icon: Award,
      color: 'saffron',
    },
    {
      label: 'Total Invoices',
      value: stats.totalInvoices,
      icon: FileText,
      color: 'lavender',
    },
    {
      label: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Pending Invoices',
      value: stats.pendingInvoices,
      icon: Users,
      color: 'orange',
    },
  ];

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      saffron: 'bg-saffron/10 text-saffron border-saffron/20',
      lavender: 'bg-lavender/10 text-lavender border-lavender/20',
      green: 'bg-green-500/10 text-green-400 border-green-500/20',
      orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    };
    return colors[color] || colors.saffron;
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="font-display font-bold text-2xl lg:text-3xl text-offwhite mb-2">
          Dashboard
        </h1>
        <p className="text-offwhite/60">Overview of your certificates and invoices</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`glass-card rounded-2xl p-5 border ${getColorClass(stat.color)}`}
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={24} />
              <span className="text-2xl font-display font-bold">{stat.value}</span>
            </div>
            <p className="text-sm opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Certificates */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-offwhite">
              Recent Certificates
            </h2>
            <Award size={20} className="text-saffron" />
          </div>

          {recentCertificates.length === 0 ? (
            <p className="text-offwhite/50 text-center py-8">No certificates generated yet</p>
          ) : (
            <div className="space-y-3">
              {recentCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="text-offwhite font-medium">{cert.internName}</p>
                    <p className="text-offwhite/50 text-sm">{cert.domain}</p>
                  </div>
                  <span className="text-offwhite/40 text-sm">
                    {new Date(cert.issueDate).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg text-offwhite">
              Recent Invoices
            </h2>
            <FileText size={20} className="text-lavender" />
          </div>

          {recentInvoices.length === 0 ? (
            <p className="text-offwhite/50 text-center py-8">No invoices generated yet</p>
          ) : (
            <div className="space-y-3">
              {recentInvoices.map((inv) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div>
                    <p className="text-offwhite font-medium">{inv.clientName}</p>
                    <p className="text-offwhite/50 text-sm">₹{inv.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-mono uppercase ${
                        inv.status === 'paid'
                          ? 'bg-green-500/20 text-green-400'
                          : inv.status === 'pending'
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
