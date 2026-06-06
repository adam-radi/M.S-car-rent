import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiPhone, FiSearch, FiUser, FiX } from 'react-icons/fi';
import { getClientsList, lookupClientByCin } from '../api/adminClientApi';
import AdminSelect from '../components/AdminSelect';
import '../styles/ManageClients.css';

const CIN_REGEX = /^[A-Z0-9]{6,12}$/;

const STATUS_OPTIONS = [
  { value: 'all', label: 'All status' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'rejected', label: 'Rejected' }
];

const PAYMENT_STYLES = {
  paid: 'is-paid',
  unpaid: 'is-unpaid',
  partial: 'is-partial'
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : '-';

const formatMoney = (value) => `${Number(value || 0).toFixed(2)} DH`;

const ManageClients = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cin, setCin] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [client, setClient] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [allClients, setAllClients] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeClientKey, setActiveClientKey] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    car: 'all',
    startDate: '',
    endDate: ''
  });

  const normalizedCin = cin.trim().toUpperCase();

  useEffect(() => {
    const fetchClientsList = async () => {
      setListLoading(true);
      try {
        const response = await getClientsList();
        setAllClients(response.clients || []);
      } catch (err) {
        console.error(err);
      } finally {
        setListLoading(false);
      }
    };

    fetchClientsList();
  }, []);

  const runLookup = async ({ nextCin = '', nextPhone = '' }) => {
    setError('');
    setHasSearched(true);
    setClient(null);
    setBookings([]);

    const normalizedSearchCin = nextCin.trim().toUpperCase();
    const normalizedSearchPhone = nextPhone.trim();

    if (!normalizedSearchCin && !normalizedSearchPhone) {
      setError(t('admin.manageClients.errors.isRequired'));
      return;
    }

    if (normalizedSearchCin && !CIN_REGEX.test(normalizedSearchCin)) {
      setError(t('admin.manageClients.errors.invalidCin')); 
      return;
    }

    setLoading(true);
    try {
      const response = await lookupClientByCin({ cin: normalizedSearchCin, phone: normalizedSearchPhone });
      setClient(response.client || null);
      setBookings(response.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || t('admin.manageClients.errors.lookupFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setActiveClientKey('');
    await runLookup({ nextCin: cin, nextPhone: phone });
  };

  const handleClientRowClick = async (row) => {
    const nextCin = row.cin && row.cin !== '-' ? row.cin : '';
    const nextPhone = row.phone && row.phone !== '-' ? row.phone : '';

    setCin(nextCin);
    setPhone(nextPhone);
    setActiveClientKey(row.key);
    await runLookup({ nextCin, nextPhone });
  };

  const carOptions = useMemo(() => {
    const cars = Array.from(new Set(bookings.map((booking) => booking.car).filter(Boolean)));
    return [{ value: 'all', label: 'All cars' }, ...cars.map((car) => ({ value: car, label: car }))];
  }, [bookings]);

  const filteredBookings = useMemo(
    () =>
      bookings.filter((booking) => {
        const matchesStatus = filters.status === 'all' || booking.status === filters.status;
        const matchesCar = filters.car === 'all' || booking.car === filters.car;
        const bookingStart = booking.start_date ? new Date(booking.start_date) : null;
        const matchesStart = !filters.startDate || (bookingStart && bookingStart >= new Date(filters.startDate));
        const matchesEnd = !filters.endDate || (bookingStart && bookingStart <= new Date(filters.endDate));

        return matchesStatus && matchesCar && matchesStart && matchesEnd;
      }),
    [bookings, filters]
  );

  const clientRows = useMemo(() => {
    const grouped = new Map();

    filteredBookings
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .forEach((booking) => {
        const cinKey = client?.cin || normalizedCin || 'NO-CIN';
        const phoneKey = booking.phone_used || 'NO-PHONE';
        const key = `${cinKey}__${phoneKey}`;

        if (!grouped.has(key)) {
          grouped.set(key, {
            key,
            full_name: booking.customer_name || 'Client',
            cin: client?.cin || normalizedCin || '-',
            phone: booking.phone_used || '-',
            email: client?.email || '-',
            linked_account: client?.linked_account ? 'YES' : 'NO',
            last_booking: booking.created_at,
            total_bookings: 1
          });
          return;
        }

        grouped.get(key).total_bookings += 1;
      });

    return Array.from(grouped.values());
  }, [filteredBookings, client, normalizedCin]);

  const showEmpty = hasSearched && !loading && !error && client === null && bookings.length === 0;
  const hasLookupResults = Boolean(client) || bookings.length > 0;
  const visibleClientRows = hasLookupResults ? clientRows : allClients;

  return (
    <div className="manage-clients admin-page-padding">
      <div className="manage-clients-header">
        <div>
          <h1>{t('admin.manageClients.title')}</h1>
          <p>{t('admin.manageClients.subtitle')}</p>
        </div>
      </div>

      <section className="client-lookup-panel">
        <form className="client-lookup-form" onSubmit={handleSearch}>
          <div className="lookup-field">
            <label>{t('admin.manageClients.labels.cin')}</label>
            <div className="lookup-input-wrap">
              <FiUser />
              <input
                type="text"
                value={cin}
                onChange={(e) => setCin(e.target.value.toUpperCase())}
                placeholder={t('admin.manageClients.placeholders.cin')}
                maxLength={12}
              />
            </div>
          </div>

          <div className="lookup-field">
            <label>{t('admin.manageClients.labels.phone')}</label>
            <div className="lookup-input-wrap">
              <FiPhone />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('admin.manageClients.placeholders.phone')}
              />
            </div>
          </div>

          <button type="submit" className="lookup-submit" disabled={loading}>
            <FiSearch />
            <span>{loading ? t('admin.manageClients.buttons.searchLoading') : t('admin.manageClients.buttons.search')}</span>
          </button>
        </form>

        {error && <div className="client-lookup-alert error">{error}</div>}
        {loading && <div className="client-lookup-alert loading">{t('admin.manageClients.search.loading')}</div>}
        {showEmpty && <div className="client-lookup-empty">{t('admin.manageClients.search.noResults')}</div>}
      </section>

      <section className="client-bookings-section client-list-section">
        <div className="client-list-header">
          <div>
            <h4>{t('admin.manageClients.list.title')}</h4>
            <p>{t('admin.manageClients.list.subtitle')}</p>
          </div>
          <span>{visibleClientRows.length} {t('admin.manageClients.list.count')}</span>
        </div>

        <div className="table-container client-list-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.manageClients.table.client')}</th>
                <th>{t('admin.manageClients.table.cin')}</th>
                <th>{t('admin.manageClients.table.phone')}</th>
                <th>{t('admin.manageClients.table.linked')}</th>
                <th>{t('admin.manageClients.table.email')}</th>
                <th>{t('admin.manageClients.table.bookings')}</th>
                <th>{t('admin.manageClients.table.latest')}</th>
              </tr>
            </thead>
            <tbody>
              {visibleClientRows.map((row) => (
                <tr
                  key={row.key}
                  className={activeClientKey === row.key ? 'client-row-active' : 'client-row-clickable'}
                  onClick={() => handleClientRowClick(row)}
                >
                  <td>{row.full_name}</td>
                  <td>{row.cin}</td>
                  <td>{row.phone}</td>
                  <td>{row.linked_account ? 'YES' : row.linked_account === 'YES' ? 'YES' : 'NO'}</td>
                  <td>{row.email}</td>
                  <td>{row.total_bookings}</td>
                  <td>{formatDate(row.last_booking || row.latest_booking)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {listLoading && (
            <div className="no-data">{t('admin.manageClients.status.loadingClients')}</div>
          )}

          {!listLoading && visibleClientRows.length === 0 && (
            <div className="no-data">{t('admin.manageClients.status.noClientRows')}</div>
          )}
        </div>
      </section>

      {hasLookupResults && (
        <section className="client-bookings-section client-list-section">
          <div className="client-search-results-note">
            <strong>{t('admin.manageClients.search.resultLabel')}</strong> {t('admin.manageClients.search.resultNote')}
          </div>
        </section>
      )}

      {client && (
        <>
          <section className="client-overview-grid">
            <article className="client-overview-card hero">
              <div className="client-overview-top">
                <div>
                  <span className="eyebrow">Client profile</span>
                  <h2>{client.full_name || client.cin}</h2>
                </div>
                {client.total_bookings >= 3 && <span className="loyal-badge">Loyal Client</span>}
              </div>

              <div className="client-meta-list">
                <div>
                  <span>{t('admin.manageClients.profile.cin')}</span>
                  <strong>{client.cin}</strong>
                </div>
                <div>
                  <span>{t('admin.manageClients.profile.linkedAccount')}</span>
                  <strong>{client.linked_account ? t('common.yes') : t('common.no')}</strong>
                </div>
                <div>
                  <span>{t('admin.manageClients.profile.email')}</span>
                  <strong>{client.email || '-'}</strong>
                </div>
                <div>
                  <span>{t('admin.manageClients.profile.phonesUsed')}</span>
                  <strong>{client.phones?.length ? client.phones.join(' • ') : '-'}</strong>
                </div>
              </div>
            </article>

            <article className="client-overview-card stat">
              <span>Total bookings</span>
              <strong>{client.total_bookings}</strong>
            </article>

            <article className="client-overview-card stat">
              <span>Total spent</span>
              <strong>{formatMoney(client.total_spent)}</strong>
            </article>

            <article className="client-overview-card stat">
              <span>Most rented car</span>
              <strong>{client.most_rented_car || '-'}</strong>
            </article>

            <article className="client-overview-card stat">
              <span>First booking</span>
              <strong>{formatDate(client.first_booking)}</strong>
            </article>

            <article className="client-overview-card stat">
              <span>Last booking</span>
              <strong>{formatDate(client.last_booking)}</strong>
            </article>
          </section>

          <section className="client-bookings-section">
            <div className="client-bookings-topbar">
              <div>
                <h3>{t('admin.manageClients.history.title')}</h3>
                <p>{t('admin.manageClients.history.subtitle')}</p>
              </div>

              <div className="client-filter-grid">
                <div className="filter-slot">
                  <label>{t('admin.manageClients.filters.status')}</label>
                  <AdminSelect
                    name="status"
                    value={filters.status}
                    onChange={(name, value) => setFilters((prev) => ({ ...prev, status: value }))}
                    options={STATUS_OPTIONS}
                  />
                </div>

                <div className="filter-slot">
                  <label>{t('admin.manageClients.filters.car')}</label>
                  <AdminSelect
                    name="car"
                    value={filters.car}
                    onChange={(name, value) => setFilters((prev) => ({ ...prev, car: value }))}
                    options={carOptions}
                  />
                </div>

                <div className="filter-slot date">
                  <label>{t('admin.manageClients.filters.from')}</label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div className="filter-slot date">
                  <label>{t('admin.manageClients.filters.to')}</label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="client-actions-bar">
              <button
                type="button"
                className="crm-action"
                onClick={() => navigate(`/admin/bookings?create=1&cin=${encodeURIComponent(client.cin)}&phone=${encodeURIComponent(client.phones?.[0] || '')}`)}
              >
                Create booking
              </button>
            </div>

            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>{t('admin.manageClients.bookingsTable.car')}</th>
                    <th>{t('admin.manageClients.bookingsTable.startDate')}</th>
                    <th>{t('admin.manageClients.bookingsTable.endDate')}</th>
                    <th>{t('admin.manageClients.bookingsTable.status')}</th>
                    <th>{t('admin.manageClients.bookingsTable.payment')}</th>
                    <th>{t('admin.manageClients.bookingsTable.total')}</th>
                    <th>{t('admin.manageClients.bookingsTable.phoneUsed')}</th>
                    <th>{t('admin.manageClients.bookingsTable.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.car}</td>
                      <td>{formatDate(booking.start_date)}</td>
                      <td>{formatDate(booking.end_date)}</td>
                      <td>
                        <span className={`crm-status-pill status-${booking.status}`}>{booking.status}</span>
                      </td>
                      <td>
                        <span className={`crm-payment-pill ${PAYMENT_STYLES[booking.payment_status] || 'is-unpaid'}`}>
                          {booking.payment_status}
                        </span>
                      </td>
                      <td>{formatMoney(booking.total_price)}</td>
                      <td>{booking.phone_used || '-'}</td>
                      <td className="crm-actions-cell">
                        <button type="button" className="crm-action ghost" onClick={() => setSelectedBooking(booking)}>
                          View details
                        </button>
                        <Link to={`/admin/bookings?bookingId=${booking.booking_id}`} className="crm-action">
                          Edit booking
                        </Link>
                        <button
                          type="button"
                          className="crm-action danger"
                          onClick={() => navigate(`/admin/bookings?bookingId=${booking.booking_id}&action=cancel`)}
                        >
                          Cancel booking
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredBookings.length === 0 && (
                <div className="no-data">No bookings match the selected filters.</div>
              )}
            </div>
          </section>
        </>
      )}

      {selectedBooking && (
        <div className="modal-backdrop abm-backdrop" onClick={() => setSelectedBooking(null)}>
          <div className="modal-box crm-modal-box" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <div className="modal-title-group">
                <div className="icon-circle">
                  <FiCalendar />
                </div>
                <div>
                  <h2>Booking Details</h2>
                  <p>{selectedBooking.customer_name}</p>
                </div>
              </div>
              <button className="close-btn-circle" type="button" onClick={() => setSelectedBooking(null)}>
                <FiX />
              </button>
            </div>

            <div className="crm-modal-body">
              <div className="crm-detail-grid">
                <div><span>Car</span><strong>{selectedBooking.car}</strong></div>
                <div><span>Start</span><strong>{formatDate(selectedBooking.start_date)}</strong></div>
                <div><span>End</span><strong>{formatDate(selectedBooking.end_date)}</strong></div>
                <div><span>Total price</span><strong>{formatMoney(selectedBooking.total_price)}</strong></div>
                <div><span>Status</span><strong>{selectedBooking.status}</strong></div>
                <div><span>Payment</span><strong>{selectedBooking.payment_status}</strong></div>
                <div><span>Created at</span><strong>{formatDate(selectedBooking.created_at)}</strong></div>
                <div><span>Phone used</span><strong>{selectedBooking.phone_used || '-'}</strong></div>
              </div>
              <div className="crm-notes-box">
                <span>Notes</span>
                <p>{selectedBooking.notes || 'No notes for this booking.'}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageClients;
