import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import {
  FaArrowUp,
  FaCalendarCheck,
  FaCar,
  FaCheckCircle,
  FaDownload,
  FaEllipsisH,
  FaExclamationTriangle,
  FaInfoCircle,
  FaMoneyBillWave,
  FaRegClock,
  FaTools,
  FaUsers,
} from 'react-icons/fa';
import { getDashboardAnalytics, getDashboardStats } from '../api/dashboardApi';
import '../styles/AdminDashboard.css';

const formatMoney = (value) => `DH ${(value || 0).toLocaleString()}`;
const formatNumber = (value) => (value || 0).toLocaleString();

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, analyticsResponse] = await Promise.all([
          getDashboardStats(),
          getDashboardAnalytics(),
        ]);

        if (statsResponse.success) setStats(statsResponse.data);
        if (analyticsResponse.success) setAnalytics(analyticsResponse.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard-state">
        <div className="dashboard-spinner"></div>
        <p>{t('admin.dashboard.loading')}</p>
      </div>
    );
  }

  if (error) {
    return <div className="admin-dashboard-state error">{error}</div>;
  }

  const today = new Date();
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 29);

  const dateLabel = `${last30Days.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} - ${today.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;

  const revenueSeries = analytics?.revenueByMonth || [];
  const activityByWeekday = analytics?.activityByWeekday || [];
  const topSellingProducts = analytics?.topSellingProducts || [];
  const repeatCustomerRate = stats?.repeatCustomerRate?.percentage || 0;
  const gaugeData = [
    { name: 'repeat', value: repeatCustomerRate, fill: '#10b981' },
    { name: 'remaining', value: Math.max(0, 100 - repeatCustomerRate), fill: '#232831' },
  ];

  let peakActivity = { day: '-', value: 0 };
  activityByWeekday.forEach((item) => {
    if (item.value > peakActivity.value) peakActivity = item;
  });

  const customerTiles = [
    {
      label: t('admin.dashboard.bookingPipeline.pending'),
      value: stats?.pendingBookings || 0,
      note: t('admin.dashboard.bookingPipeline.pendingNote'),
      accent: 'violet',
      icon: <FaRegClock />,
    },
    {
      label: t('admin.dashboard.bookingPipeline.active'),
      value: stats?.activeBookings || 0,
      note: t('admin.dashboard.bookingPipeline.activeNote'),
      accent: 'green',
      icon: <FaCalendarCheck />,
    },
    {
      label: t('admin.dashboard.bookingPipeline.completed'),
      value: stats?.completedBookings || 0,
      note: t('admin.dashboard.bookingPipeline.completedNote'),
      accent: 'amber',
      icon: <FaCheckCircle />,
    },
  ];

  const statCards = [
    {
      title: t('admin.dashboard.statCards.fleet'),
      value: formatNumber(stats?.totalCars),
      meta: `${formatNumber(stats?.availableCars)} ${t('admin.dashboard.statCards.availableNow')}`,
      trend: `${stats?.fleetUtilization || 0}% ${t('admin.dashboard.statCards.utilized')}`,
      icon: <FaCar />,
      accent: 'blue',
    },
    {
      title: t('admin.dashboard.statCards.reservations'),
      value: formatNumber(stats?.totalBookings),
      meta: `${formatNumber(stats?.confirmedBookings)} ${t('admin.dashboard.statCards.confirmedBookings')}`,
      trend: `${formatNumber(stats?.activeBookings)} ${t('admin.dashboard.statCards.activeRightNow')}`,
      icon: <FaCalendarCheck />,
      accent: 'violet',
    },
    {
      title: t('admin.dashboard.statCards.customers'),
      value: formatNumber(stats?.totalUsers),
      meta: `${stats?.repeatCustomerRate?.percentage || 0}% ${t('admin.dashboard.statCards.repeatRate')}`,
      trend: `${formatNumber(stats?.customerBreakdown?.activeCustomersLast30Days)} ${t('admin.dashboard.statCards.activeLast30Days')}`,
      icon: <FaUsers />,
      accent: 'green',
    },
    {
      title: t('admin.dashboard.statCards.revenue'),
      value: formatMoney(stats?.totalRevenue),
      meta: `${formatMoney(stats?.revenueLast30Days)} ${t('admin.dashboard.statCards.last30Days')}`,
      trend: `${formatNumber(stats?.completedBookings)} ${t('admin.dashboard.statCards.completedBookings')}`,
      icon: <FaMoneyBillWave />,
      accent: 'amber',
    },
  ];

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div>
          <h1>{t('admin.dashboard.title')}</h1>
          <p>{t('admin.dashboard.subtitle')}</p>
        </div>

        <div className="dashboard-header-actions">
          <div className="dashboard-chip">
            <FaCalendarCheck />
            <span>{dateLabel}</span>
          </div>
          <div className="dashboard-chip muted">
            <span>{t('admin.dashboard.last30Days')}</span>
          </div>
          <button type="button" className="dashboard-button">
            <FaDownload />
            <span>{t('admin.dashboard.buttons.export')}</span>
          </button>
        </div>
      </header>

      {stats?.healthAlerts && (stats.healthAlerts.expiredCount > 0 || stats.healthAlerts.expiringSoonCount > 0) && (
        <div className="dashboard-alerts">
          {stats.healthAlerts.expiredCount > 0 && (
            <div className="dashboard-alert danger">
              <FaExclamationTriangle className="alert-icon" />
              <div>
                <strong>{formatNumber(stats.healthAlerts.expiredCount)} {t('admin.dashboard.alerts.vehicles')}</strong> {t('admin.dashboard.alerts.expiredDocs')}
              </div>
              <Link to="/admin/fleet-health" className="alert-link">
                {t('admin.dashboard.alerts.manageNow')}
              </Link>
            </div>
          )}

          {stats.healthAlerts.expiringSoonCount > 0 && (
            <div className="dashboard-alert warning">
              <FaInfoCircle className="alert-icon" />
              <div>
                <strong>{formatNumber(stats.healthAlerts.expiringSoonCount)} {t('admin.dashboard.alerts.vehicles')}</strong> {t('admin.dashboard.alerts.expiringWithin7')}
              </div>
              <Link to="/admin/documents" className="alert-link">
                {t('admin.dashboard.alerts.reviewFleet')}
              </Link>
            </div>
          )}
        </div>
      )}

      <section className="stats-grid">
        {statCards.map((card) => (
          <article key={card.title} className={`stat-card accent-${card.accent}`}>
            <div className="stat-card-top">
              <span>{card.title}</span>
              <div className={`stat-icon accent-${card.accent}`}>{card.icon}</div>
            </div>
            <h2>{card.value}</h2>
            <div className={`stat-trend accent-${card.accent}`}>
              <FaArrowUp />
              <span>{card.trend}</span>
            </div>
            <p>{card.meta}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-main-grid">
        <div className="dashboard-left-column">
          <article className="dashboard-card revenue-card">
            <div className="card-header">
              <div>
                <span className="eyebrow">{t('admin.dashboard.revenueCard.title')}</span>
                <h3>{t('admin.dashboard.revenueCard.totalProfit')}</h3>
              </div>
              <FaEllipsisH className="card-menu" />
            </div>

            <div className="revenue-summary">
              <div>
                <strong>{formatMoney(stats?.totalRevenue)}</strong>
                <span>{t('admin.dashboard.revenueCard.completedRevenue')}</span>
              </div>
              <div>
                <strong>{formatMoney(stats?.revenueLast30Days)}</strong>
                <span>{t('admin.dashboard.revenueCard.last30Days')}</span>
              </div>
            </div>

            <div className="chart-shell">
              <ResponsiveContainer width="100%" height={290}>
                <LineChart data={revenueSeries}>
                  <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8f98a5', fontSize: 12 }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#8f98a5', fontSize: 12 }}
                    tickFormatter={(value) => `${Math.round(value / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [formatMoney(value), t('admin.dashboard.revenueCard.revenue')]}
                    contentStyle={{
                      backgroundColor: '#15191f',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      color: '#f5f7fa',
                    }}
                    labelStyle={{ color: '#f5f7fa' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#e50914"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#e50914', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#ffffff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="dashboard-card customer-card">
            <div className="card-header">
              <div>
                <span className="eyebrow">{t('admin.dashboard.bookingCard.title')}</span>
                <h3>{t('admin.dashboard.bookingCard.pipeline')}</h3>
              </div>
              <FaEllipsisH className="card-menu" />
            </div>

            <div className="customer-tiles">
              {customerTiles.map((tile) => (
                <div key={tile.label} className={`customer-tile ${tile.accent}`}>
                  <div className="customer-tile-icon">{tile.icon}</div>
                  <strong>{formatNumber(tile.value)}</strong>
                  <span>{tile.label}</span>
                  <small>{tile.note}</small>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card products-card">
            <div className="card-header">
              <div>
                <span className="eyebrow">{t('admin.dashboard.productsCard.title')}</span>
                <h3>{t('admin.dashboard.productsCard.topSellingProducts')}</h3>
              </div>
              <FaEllipsisH className="card-menu" />
            </div>

            <div className="products-table-shell">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>{t('admin.dashboard.productsCard.car')}</th>
                    <th>{t('admin.dashboard.productsCard.plate')}</th>
                    <th>{t('admin.dashboard.productsCard.bookings')}</th>
                    <th>{t('admin.dashboard.productsCard.revenue')}</th>
                    <th>{t('admin.dashboard.productsCard.ratePerDay')}</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.length > 0 ? (
                    topSellingProducts.map((item) => (
                      <tr key={item.carId}>
                        <td>
                          <div className="product-name">
                            <div className="product-icon">
                              <FaCar />
                            </div>
                            <div>
                              <strong>{item.name}</strong>
                              <span>{item.brand}</span>
                            </div>
                          </div>
                        </td>
                        <td>{item.licensePlate}</td>
                        <td>{formatNumber(item.sold)}</td>
                        <td className="highlight-cell">{formatMoney(item.revenue)}</td>
                        <td>{formatMoney(item.dailyPrice)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="table-empty">
                        {t('admin.dashboard.productsCard.noData')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        </div>

        <div className="dashboard-right-column">
          <article className="dashboard-card side-card">
            <div className="card-header">
              <div>
                <span className="eyebrow">{t('admin.dashboard.activityCard.title')}</span>
                <h3>{t('admin.dashboard.activityCard.mostActiveDay')}</h3>
              </div>
              <FaEllipsisH className="card-menu" />
            </div>

            <div className="side-card-summary">
              <strong>{peakActivity.day}</strong>
              <span>{formatNumber(peakActivity.value)} {t('admin.dashboard.activityCard.bookingsCreated')}</span>
            </div>

            <div className="chart-shell compact">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={activityByWeekday}>
                  <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                    {activityByWeekday.map((entry) => (
                      <Cell key={entry.day} fill={entry.active ? '#3b82f6' : '#2a3038'} />
                    ))}
                  </Bar>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#8f98a5', fontSize: 12 }} />
                  <YAxis hide />
                  <Tooltip
                    formatter={(value) => [formatNumber(value), t('admin.dashboard.activityCard.bookings')]}
                    contentStyle={{
                      backgroundColor: '#15191f',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '14px',
                      color: '#f5f7fa',
                    }}
                    labelStyle={{ color: '#f5f7fa' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="dashboard-card side-card">
            <div className="card-header">
              <div>
                <span className="eyebrow">{t('admin.dashboard.loyaltyCard.title')}</span>
                <h3>{t('admin.dashboard.loyaltyCard.repeatRate')}</h3>
              </div>
              <FaEllipsisH className="card-menu" />
            </div>

            <div className="gauge-shell">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={gaugeData}
                    dataKey="value"
                    cx="50%"
                    cy="100%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={74}
                    outerRadius={96}
                    stroke="none"
                  >
                    {gaugeData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="gauge-content">
                <strong>{repeatCustomerRate}%</strong>
                <span>
                  {formatNumber(stats?.repeatCustomerRate?.repeatCustomers)} {t('admin.dashboard.loyaltyCard.of')} {formatNumber(stats?.repeatCustomerRate?.totalCustomers)} {t('admin.dashboard.loyaltyCard.customersBookedMore')}
                </span>
              </div>
            </div>
          </article>

          <article className="dashboard-card side-card fleet-status-card">
            <div className="card-header">
              <div>
                <span className="eyebrow">Fleet operations</span>
                <h3>Maintenance Snapshot</h3>
              </div>
              <FaEllipsisH className="card-menu" />
            </div>

            <div className="fleet-metric-row">
              <div>
                <span>{t('admin.dashboard.fleetCard.inMaintenance')}</span>
                <strong>{formatNumber(stats?.maintenanceCars)}</strong>
              </div>
              <FaTools className="fleet-status-icon" />
            </div>

            <div className="fleet-metric-row">
              <div>
                <span>{t('admin.dashboard.fleetCard.fleetUtilization')}</span>
                <strong>{formatNumber(stats?.fleetUtilization)}%</strong>
              </div>
              <FaCar className="fleet-status-icon" />
            </div>

            <div className="fleet-metric-row">
              <div>
                <span>{t('admin.dashboard.fleetCard.documentsExpiring')}</span>
                <strong>{formatNumber(stats?.healthAlerts?.expiringSoonCount)}</strong>
              </div>
              <FaInfoCircle className="fleet-status-icon" />
            </div>

            <div className="fleet-metric-row">
              <div>
                <span>{t('admin.dashboard.fleetCard.cancelledBookings')}</span>
                <strong>{formatNumber(stats?.cancelledBookings)}</strong>
              </div>
              <FaUsers className="fleet-status-icon" />
            </div>
          </article>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
