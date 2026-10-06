import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Eye, 
  EyeOff, 
  Star, 
  Award, 
  CheckCircle, 
  Clock, 
  X, 
  Save, 
  ExternalLink,
  MapPin,
  ShieldCheck,
  RefreshCw,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Upload,
  Phone,
  Globe,
  CheckSquare
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const TOKEN_STORAGE_KEY = 'valpar_admin_token';

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_STORAGE_KEY, token);
    else localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    // Storage unavailable (private mode): session lasts only for this page load
  }
}

export interface PlaceAdminItem {
  id: string;
  name: string;
  slug?: string;
  tagline?: string;
  shortDescription?: string;
  description?: string;
  category: string;
  subCategory?: string;
  tags?: string[];
  address: string;
  district?: string;
  commune: string;
  city: string;
  region?: string;
  latitude: number;
  longitude: number;
  phone?: string;
  publicEmail?: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  whatsapp?: string;
  priceLevel?: string;
  imageUrl?: string;
  coverPhoto?: string;
  rating?: number | null;
  reviewCount?: number;
  verifiedVisits?: number;
  editorialScore?: number | null;
  isFeatured?: boolean;
  isRecommended?: boolean;
  publicationStatus?: 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'ARCHIVED';
  verificationStatus?: 'UNVERIFIED' | 'REVIEWED' | 'VERIFIED';
  dataSource?: string;
  partnerId?: string | null;
  createdAt?: string;
  updatedAt?: string;
  lastVerifiedAt?: string;
}

export const AdminPlaceCMS: React.FC = () => {
  const [places, setPlaces] = useState<PlaceAdminItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(readStoredToken);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedVerification, setSelectedVerification] = useState('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState<PlaceAdminItem | null>(null);

  // Import Batch State
  const [importJsonText, setImportJsonText] = useState('');
  const [importReport, setImportReport] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PlaceAdminItem>>({
    name: '',
    shortDescription: '',
    description: '',
    category: 'Restaurante',
    subCategory: 'Gastronomía Local',
    address: '',
    district: 'Valparaíso',
    commune: 'Valparaíso',
    city: 'Valparaíso',
    region: 'Valparaíso',
    latitude: -33.0472,
    longitude: -71.6127,
    phone: '',
    publicEmail: '',
    website: '',
    instagram: '',
    priceLevel: '$$',
    coverPhoto: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    publicationStatus: 'DRAFT',
    verificationStatus: 'UNVERIFIED',
    dataSource: 'MANUAL_VALPAR',
    isRecommended: false,
    isFeatured: false,
    editorialScore: null,
    rating: null
  });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const setSession = (token: string | null) => {
    writeStoredToken(token);
    setAuthToken(token);
  };

  // 401/403 means the stored token is missing, expired or rejected: send the admin back to login
  const expireSessionIfUnauthorized = (res: Response) => {
    if (res.status !== 401 && res.status !== 403) return false;
    setSession(null);
    setPlaces([]);
    setLoginError('Tu sesión expiró o no tiene permisos. Inicia sesión nuevamente.');
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.token) {
        setLoginError(data.message || 'Credenciales inválidas.');
        return;
      }
      setLoginPassword('');
      setSession(data.token);
    } catch {
      setLoginError('No se pudo conectar con la API. ¿Está corriendo el servidor en el puerto 3001?');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const fetchPlaces = async () => {
    if (!authToken) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/places`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      if (expireSessionIfUnauthorized(res)) return;
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setPlaces(Array.isArray(data.places) ? data.places : []);
    } catch (err: any) {
      console.error('Error fetching admin places:', err);
      setPlaces([]);
      showToast(`No se pudieron cargar los lugares: ${err.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [authToken]);

  const handleOpenCreate = () => {
    setEditingPlace(null);
    setFormData({
      name: '',
      shortDescription: '',
      description: '',
      category: 'Restaurante',
      subCategory: 'Gastronomía Local',
      address: '',
      district: 'Valparaíso',
      commune: 'Valparaíso',
      city: 'Valparaíso',
      region: 'Valparaíso',
      latitude: -33.0472,
      longitude: -71.6127,
      phone: '',
      publicEmail: '',
      website: '',
      instagram: '',
      priceLevel: '$$',
      coverPhoto: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      publicationStatus: 'DRAFT',
      verificationStatus: 'UNVERIFIED',
      dataSource: 'MANUAL_VALPAR',
      isRecommended: false,
      isFeatured: false,
      editorialScore: null,
      rating: null
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (place: PlaceAdminItem) => {
    setEditingPlace(place);
    setFormData({ ...place });
    setIsModalOpen(true);
  };

  const handleOpenPreview = (place: PlaceAdminItem) => {
    setEditingPlace(place);
    setIsPreviewOpen(true);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      showToast('Nombre y dirección son obligatorios.', 'error');
      return;
    }

    try {
      const isEdit = !!editingPlace;
      const url = isEdit ? `${API_BASE}/admin/places/${editingPlace.id}` : `${API_BASE}/admin/places`;
      const method = isEdit ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(formData)
      });

      if (expireSessionIfUnauthorized(res)) {
        setIsModalOpen(false);
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Error en petición API');
      }

      showToast(isEdit ? 'Lugar actualizado correctamente en PostgreSQL' : 'Lugar guardado como Borrador (DRAFT) en PostgreSQL', 'success');
      setIsModalOpen(false);
      fetchPlaces();
    } catch (err: any) {
      showToast(`Error al guardar: ${err.message}`, 'error');
    }
  };

  const handleTogglePublish = async (place: PlaceAdminItem) => {
    const nextStatus = place.publicationStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    try {
      const res = await fetch(`${API_BASE}/admin/places/${place.id}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ publicationStatus: nextStatus })
      });

      if (expireSessionIfUnauthorized(res)) return;
      if (!res.ok) throw new Error('Error al modificar publicación');
      showToast(`Estado de "${place.name}" cambiado a ${nextStatus}`, 'success');
      fetchPlaces();
    } catch (err: any) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const handleToggleVerify = async (place: PlaceAdminItem) => {
    const nextStatus = place.verificationStatus === 'VERIFIED' ? 'UNVERIFIED' : 'VERIFIED';
    try {
      const res = await fetch(`${API_BASE}/admin/places/${place.id}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ verificationStatus: nextStatus })
      });

      if (expireSessionIfUnauthorized(res)) return;
      if (!res.ok) throw new Error('Error al modificar verificación');
      showToast(`Estado de verificación de "${place.name}" cambiado a ${nextStatus}`, 'success');
      fetchPlaces();
    } catch (err: any) {
      showToast(`Error: ${err.message}`, 'error');
    }
  };

  const handleExecuteBatchImport = async () => {
    if (!importJsonText.trim()) {
      showToast('Por favor pega un arreglo JSON válido con lugares.', 'error');
      return;
    }

    try {
      const parsed = JSON.parse(importJsonText);
      const res = await fetch(`${API_BASE}/admin/places/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ places: Array.isArray(parsed) ? parsed : [parsed] })
      });

      if (expireSessionIfUnauthorized(res)) return;

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error en importación');

      setImportReport(data.report);
      showToast(data.message, 'success');
      fetchPlaces();
    } catch (err: any) {
      showToast(`Error en formato de importación: ${err.message}`, 'error');
    }
  };

  // Filtered Places List
  const filteredPlaces = places.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                          p.commune?.toLowerCase().includes(search.toLowerCase()) ||
                          p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCommune = selectedCommune === 'all' || p.commune === selectedCommune;
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || p.publicationStatus === selectedStatus;
    const matchesVerif = selectedVerification === 'all' || p.verificationStatus === selectedVerification;
    return matchesSearch && matchesCommune && matchesCategory && matchesStatus && matchesVerif;
  });

  const totalPlaces = places.length;
  const publishedCount = places.filter(p => p.publicationStatus === 'PUBLISHED').length;
  const draftCount = places.filter(p => p.publicationStatus === 'DRAFT').length;
  const unverifiedCount = places.filter(p => p.verificationStatus === 'UNVERIFIED').length;
  const verifiedCount = places.filter(p => p.verificationStatus === 'VERIFIED').length;

  if (!authToken) {
    return (
      <div className="max-w-md mx-auto mt-12 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-black text-white">Acceso VALPAR CMS</h2>
        <p className="text-slate-400 text-sm mt-1 mb-5">Inicia sesión para administrar el catálogo de lugares.</p>
        {loginError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950 border border-rose-700 text-rose-200 text-sm flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{loginError}</span>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            required
            autoComplete="username"
            placeholder="correo@valpar.cl"
            value={loginEmail}
            onChange={e => setLoginEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Contraseña"
            value={loginPassword}
            onChange={e => setLoginPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-sm transition"
          >
            {isLoggingIn ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-2xl flex items-center space-x-3 border font-medium ${
          toast.type === 'success' 
            ? 'bg-emerald-950 border-emerald-700 text-emerald-200' 
            : 'bg-rose-950 border-rose-700 text-rose-200'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <AlertCircle className="w-5 h-5 text-rose-400" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-black text-white tracking-tight">VALPAR CMS 0.4 — Catálogo Real & Curaduría</h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              PostgreSQL Fuente de Verdad
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Gestión editorial de lugares verificados en Valparaíso, Viña del Mar, Concón, Reñaca, Olmué y Quinta Región.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsImportOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>Importar (CSV/JSON)</span>
          </button>

          <button 
            onClick={fetchPlaces} 
            className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
            title="Recargar catálogo"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setSession(null)}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs border border-slate-700 transition"
          >
            Cerrar sesión
          </button>

          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Agregar Lugar Real</span>
          </button>
        </div>
      </div>

      {/* Honest Metric Cards (Section 2, 3, 5) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Registros</div>
          <div className="text-2xl font-black text-white mt-1">{totalPlaces}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">En PostgreSQL</div>
        </div>

        <div className="bg-slate-900 border border-emerald-900/40 p-4 rounded-xl">
          <div className="text-emerald-400 text-xs font-medium uppercase tracking-wider">Publicados</div>
          <div className="text-2xl font-black text-emerald-300 mt-1">{publishedCount}</div>
          <div className="text-[10px] text-emerald-500 mt-0.5">Visibles en App Móvil</div>
        </div>

        <div className="bg-slate-900 border border-amber-900/40 p-4 rounded-xl">
          <div className="text-amber-400 text-xs font-medium uppercase tracking-wider">Borradores (Draft)</div>
          <div className="text-2xl font-black text-amber-300 mt-1">{draftCount}</div>
          <div className="text-[10px] text-amber-500 mt-0.5">Pendientes de revisión</div>
        </div>

        <div className="bg-slate-900 border border-purple-900/40 p-4 rounded-xl">
          <div className="text-purple-400 text-xs font-medium uppercase tracking-wider">Verificados (Verified)</div>
          <div className="text-2xl font-black text-purple-300 mt-1">{verifiedCount}</div>
          <div className="text-[10px] text-purple-500 mt-0.5">Información confirmada</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Sin Verificar</div>
          <div className="text-2xl font-black text-slate-300 mt-1">{unverifiedCount}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">UNVERIFIED por defecto</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por nombre, comuna o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedCommune}
            onChange={(e) => setSelectedCommune(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium px-3 py-2.5 rounded-xl focus:outline-none"
          >
            <option value="all">Todas las comunas</option>
            <option value="Valparaíso">Valparaíso</option>
            <option value="Viña del Mar">Viña del Mar</option>
            <option value="Concón">Concón</option>
            <option value="Reñaca">Reñaca</option>
            <option value="Quilpué">Quilpué</option>
            <option value="Olmué">Olmué</option>
            <option value="Zapallar">Zapallar</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium px-3 py-2.5 rounded-xl focus:outline-none"
          >
            <option value="all">Todos los estados</option>
            <option value="PUBLISHED">Publicados</option>
            <option value="DRAFT">Borradores (Draft)</option>
            <option value="PAUSED">Pausados</option>
            <option value="ARCHIVED">Archivados</option>
          </select>

          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-medium px-3 py-2.5 rounded-xl focus:outline-none"
          >
            <option value="all">Verificación</option>
            <option value="VERIFIED">VERIFIED</option>
            <option value="REVIEWED">REVIEWED</option>
            <option value="UNVERIFIED">UNVERIFIED</option>
          </select>
        </div>
      </div>

      {/* Places Table (Section 17) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Lugar</th>
                <th className="py-3 px-4">Ubicación</th>
                <th className="py-3 px-4">Categoría</th>
                <th className="py-3 px-4 text-center">Publicación</th>
                <th className="py-3 px-4 text-center">Verificación</th>
                <th className="py-3 px-4 text-center">Rating Real</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-400" />
                    Cargando catálogo en PostgreSQL...
                  </td>
                </tr>
              ) : filteredPlaces.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-medium">
                    Sin registros. Utiliza "+ Agregar Lugar Real" o el botón de Importación.
                  </td>
                </tr>
              ) : (
                filteredPlaces.map((place) => {
                  const isPub = place.publicationStatus === 'PUBLISHED';
                  return (
                    <tr key={place.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={place.coverPhoto || place.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&q=80'} 
                            alt={place.name} 
                            className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700"
                          />
                          <div>
                            <div className="font-bold text-white flex items-center space-x-1.5">
                              <span>{place.name}</span>
                              {place.isRecommended && <span className="text-[10px] text-purple-400">★</span>}
                            </div>
                            <div className="text-xs text-slate-400 line-clamp-1">{place.shortDescription || place.address}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs text-slate-300">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{place.commune || place.district}, {place.city}</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs font-semibold text-slate-300">
                        {place.category}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          isPub 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {isPub ? 'PUBLISHED' : (place.publicationStatus || 'DRAFT')}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          place.verificationStatus === 'VERIFIED'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : place.verificationStatus === 'REVIEWED'
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {place.verificationStatus || 'UNVERIFIED'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center text-xs">
                        {place.rating !== null && place.rating !== undefined ? (
                          <span className="font-bold text-amber-400">★ {place.rating} ({place.reviewCount || 0})</span>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Sin reseñas todavía</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenPreview(place)}
                            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                            title="Vista Previa"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleVerify(place)}
                            className={`p-1.5 rounded-lg border transition ${
                              place.verificationStatus === 'VERIFIED'
                                ? 'bg-purple-950/60 border-purple-800 text-purple-300'
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-purple-300'
                            }`}
                            title="Verificar información"
                          >
                            <CheckSquare className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleTogglePublish(place)}
                            className={`p-1.5 rounded-lg border transition ${
                              isPub 
                                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' 
                                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-emerald-400'
                            }`}
                            title={isPub ? 'Despublicar' : 'Publicar'}
                          >
                            {isPub ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>

                          <button
                            onClick={() => handleOpenEdit(place)}
                            className="p-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800 text-indigo-300 hover:bg-indigo-900"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal by Organized Sections (Section 18) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingPlace ? `Editar Lugar: ${editingPlace.name}` : 'Nuevo Lugar en VALPAR (Borrador / DRAFT)'}
                </h3>
                <p className="text-xs text-slate-400">Valores por defecto de honestidad: rating NULL, UNVERIFIED y DRAFT</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-6">
              {/* Sección 1: Información Básica */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold uppercase text-indigo-400 tracking-wider">1. Información Básica</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Nombre del Lugar *</label>
                    <input
                      type="text"
                      required
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                      placeholder="Ej: Café Turri Valparaíso"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Categoría Principal *</label>
                    <select
                      value={formData.category || 'Restaurante'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                    >
                      <option value="Restaurante">Restaurante</option>
                      <option value="Cafetería">Cafetería</option>
                      <option value="Bar & Rooftop">Bar & Rooftop</option>
                      <option value="Experiencia">Experiencia</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Descripción Corta</label>
                    <input
                      type="text"
                      value={formData.shortDescription || ''}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                      placeholder="Ej: Icónica vista a la bahía y pastelería de especialidad"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Descripción Completa</label>
                    <textarea
                      rows={3}
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Ubicación */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-extrabold uppercase text-indigo-400 tracking-wider">2. Ubicación Regional</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Dirección Física *</label>
                    <input
                      type="text"
                      required
                      value={formData.address || ''}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Comuna *</label>
                    <input
                      type="text"
                      required
                      value={formData.commune || 'Valparaíso'}
                      onChange={(e) => setFormData({ ...formData, commune: e.target.value, district: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Ciudad *</label>
                    <input
                      type="text"
                      required
                      value={formData.city || 'Valparaíso'}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Latitud</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude || 0}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Longitud</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude || 0}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Contacto & Redes */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-extrabold uppercase text-indigo-400 tracking-wider">3. Contacto & Redes Sociales</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Teléfono</label>
                    <input
                      type="text"
                      value={formData.phone || ''}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                      placeholder="Ej: +56 32 225 2091"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Instagram (@usuario)</label>
                    <input
                      type="text"
                      value={formData.instagram || ''}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                      placeholder="@cafeturri"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Sitio Web</label>
                    <input
                      type="text"
                      value={formData.website || ''}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              {/* Sección 4: Estado y Calidad de Datos (Section 5 & 6) */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-extrabold uppercase text-indigo-400 tracking-wider">4. Estado Editorial & Honestidad de Datos</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Estado Publicación</label>
                    <select
                      value={formData.publicationStatus || 'DRAFT'}
                      onChange={(e) => setFormData({ ...formData, publicationStatus: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                    >
                      <option value="DRAFT">DRAFT (Borrador)</option>
                      <option value="PUBLISHED">PUBLISHED (Publicado en App)</option>
                      <option value="PAUSED">PAUSED (Pausado)</option>
                      <option value="ARCHIVED">ARCHIVED (Archivado)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Verificación</label>
                    <select
                      value={formData.verificationStatus || 'UNVERIFIED'}
                      onChange={(e) => setFormData({ ...formData, verificationStatus: e.target.value as any })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                    >
                      <option value="UNVERIFIED">UNVERIFIED (Sin verificar)</option>
                      <option value="REVIEWED">REVIEWED (Revisado)</option>
                      <option value="VERIFIED">VERIFIED (Verificado)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Fuente de Datos</label>
                    <select
                      value={formData.dataSource || 'MANUAL_VALPAR'}
                      onChange={(e) => setFormData({ ...formData, dataSource: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:border-indigo-500"
                    >
                      <option value="MANUAL_VALPAR">MANUAL_VALPAR</option>
                      <option value="RESTAURANT_PROVIDED">RESTAURANT_PROVIDED</option>
                      <option value="PUBLIC_SOURCE">PUBLIC_SOURCE</option>
                      <option value="USER_SUBMITTED">USER_SUBMITTED</option>
                      <option value="API_IMPORT">API_IMPORT</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-6 pt-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.isRecommended}
                      onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600"
                    />
                    <span className="text-xs font-bold text-slate-300">★ Recomendado por VALPAR</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-indigo-600"
                    />
                    <span className="text-xs font-bold text-slate-300">Destacado en Home</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-slate-800">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold">
                  Cancelar
                </button>
                <button type="submit" className="flex items-center space-x-2 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30">
                  <Save className="w-4 h-4" />
                  <span>{editingPlace ? 'Guardar Cambios' : 'Crear Borrador en PostgreSQL'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal (Section 19) */}
      {isPreviewOpen && editingPlace && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Vista Previa Móvil VALPAR</span>
              <button onClick={() => setIsPreviewOpen(false)} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-800">
              <img src={editingPlace.coverPhoto || editingPlace.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'} className="w-full h-44 object-cover" />
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase">{editingPlace.commune}, {editingPlace.city}</span>
                  <span className="text-xs font-bold text-amber-400">
                    {editingPlace.rating !== null && editingPlace.rating !== undefined ? `★ ${editingPlace.rating}` : 'Sin reseñas'}
                  </span>
                </div>
                <h3 className="text-lg font-black text-white">{editingPlace.name}</h3>
                <p className="text-xs text-slate-400">{editingPlace.shortDescription || editingPlace.tagline || editingPlace.address}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Drawer/Modal (Section 46, 47, 48) */}
      {isImportOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                <span>Importación Masiva (Lote CSV / JSON)</span>
              </h3>
              <button onClick={() => setIsImportOpen(false)} className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Los lugares importados ingresan automáticamente en estado <strong className="text-amber-400">DRAFT</strong> y <strong className="text-purple-400">UNVERIFIED</strong>. Se ejecutará detección de duplicados por slug.
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='Pega un arreglo JSON con lugares: [{"name": "Café Ejemplo", "category": "Cafetería", "city": "Valparaíso", "commune": "Valparaíso", "address": "Calle 123", "latitude": -33.04, "longitude": -71.62}]'
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:border-indigo-500 font-mono"
            />

            {importReport && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-emerald-400">Resultado de Importación:</div>
                <div>Recibidos: {importReport.totalReceived} | Creados como DRAFT: {importReport.createdDrafts} | Duplicados detectados: {importReport.duplicatesDetected}</div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
              <button onClick={() => setIsImportOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300">
                Cerrar
              </button>
              <button onClick={handleExecuteBatchImport} className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30">
                Procesar e Insertar DRAFTS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
