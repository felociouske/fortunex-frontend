import { useState, useEffect } from "react";
import DashboardNavbar from "../../components/DashboardNavbar"; 
import useAuthStore from "../../store/authStore";
import { authAPI } from "../../api/auth";

const panel = "border border-fx-border bg-fx-surface p-6";
const heading = "text-lg font-semibold border-b border-fx-border pb-3 mb-5";
const label = "block text-xs text-fx-text-dim mb-1";
const field = "w-full bg-transparent border border-fx-border px-3 py-2 text-sm text-fx-text focus:outline-none focus:border-fx-text-dim";
const plainButton = "border border-fx-border px-4 py-1.5 text-sm text-fx-text hover:border-fx-text hover:bg-white/5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

function StatusBadge({ status }) {
  const text = {
    PENDING: "Not submitted", SUBMITTED: "Under review",
    VERIFIED: "Verified", REJECTED: "Rejected", SUSPENDED: "Coming soon",
  }[status] || status;
  return <span className="text-xs border border-fx-border px-2 py-0.5 text-fx-text-dim">{text}</span>;
}

/* ── 1. Proof of Identity ───────────────────────────────────────────────── */
function IdentitySection({ data, onSubmitted }) {
  const [documentType, setDocumentType] = useState("NATIONAL_ID");
  const [front, setFront] = useState(null);
  const [back, setBack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const needsBack = documentType !== "PASSPORT";
  const locked = data?.status === "SUBMITTED" || data?.status === "VERIFIED";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!front) return setError("Please select the front/main image.");
    if (needsBack && !back) return setError("This document type needs a back image too.");

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("document_type", documentType);
      fd.append("front_image", front);
      if (back) fd.append("back_image", back);
      await authAPI.submitKYCIdentity(fd);
      onSubmitted();
    } catch (err) {
      const d = err.response?.data;
      setError(d?.back_image?.[0] || d?.front_image?.[0] || d?.detail || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={panel}>
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-fx-border">
        <h3 className="text-lg font-semibold">1. Proof of Identity</h3>
        <StatusBadge status={data?.status || "PENDING"} />
      </div>
      <p className="text-fx-text-dim text-sm mb-4">
        Submit a National ID, Passport, or Driver's License. National ID and Driver's License need both sides; a Passport only needs the bio page.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Document type</label>
          <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className={field} disabled={locked}>
            <option value="NATIONAL_ID">National ID</option>
            <option value="PASSPORT">Passport</option>
            <option value="DRIVERS_LICENSE">Driver's License</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>{documentType === "PASSPORT" ? "Bio page" : "Front"}</label>
            <input type="file" accept="image/*" onChange={(e) => setFront(e.target.files?.[0] || null)} className={field} disabled={locked} />
          </div>
          {needsBack && (
            <div>
              <label className={label}>Back</label>
              <input type="file" accept="image/*" onChange={(e) => setBack(e.target.files?.[0] || null)} className={field} disabled={locked} />
            </div>
          )}
        </div>

        {error && <div className="text-fx-red text-sm">{error}</div>}

        <button type="submit" disabled={loading || locked} className={plainButton}>
          {locked ? "Submitted" : loading ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}

/* ── 2. Proof of Address ────────────────────────────────────────────────── */
function AddressSection({ data, onSubmitted }) {
  const [image, setImage] = useState(null);
  const [coords, setCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const locked = data?.status === "SUBMITTED" || data?.status === "VERIFIED";

  const captureLocation = () => {
      setError("");
      if (!navigator.geolocation) {
        setError("Your browser doesn't support location access.");
        return;
      }
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // Rounded here, not just at display time. The backend's
          // DecimalField only allows 6 decimal places, and the raw
          // browser value has far more precision than that, if we stored
          // the raw value, the display would look rounded (toFixed just
          // formats the string) while the actual number sent to the API
          // stays untruncated and gets rejected. Six decimal places of
          // GPS precision is already about 11cm of accuracy, more than
          // enough for address verification.
          setCoords({
            latitude: Number(pos.coords.latitude.toFixed(6)),
            longitude: Number(pos.coords.longitude.toFixed(6)),
          });
          setLocating(false);
        },
        () => {
          setError("Location access was denied. Please allow it to continue.");
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      if (!image) return setError("Please select a receipt or a photo of your location.");
      if (!coords) return setError("Please share your location first.");

      setLoading(true);
      try {
        const fd = new FormData();
        fd.append("address_image", image);
        fd.append("latitude", coords.latitude);
        fd.append("longitude", coords.longitude);
        await authAPI.submitKYCAddress(fd);
        onSubmitted();
      } catch (err) {
        const d = err.response?.data;
        // Now also checks latitude/longitude, this is the exact key that
        // was actually failing, the previous version never looked at it
        // so it always fell through to the generic message below.
        setError(
          d?.address_image?.[0] || d?.latitude?.[0] || d?.longitude?.[0] || d?.detail || "Upload failed."
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className={panel}>
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-fx-border">
        <h3 className="text-lg font-semibold">2. Proof of Address</h3>
        <StatusBadge status={data?.status || "PENDING"} />
      </div>
      <p className="text-fx-text-dim text-sm mb-4">
        Upload a utility bill/receipt OR a photo of your location, and share your current GPS coordinates.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className={label}>Receipt or location photo</label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className={field} disabled={locked} />
        </div>

        <div>
          <label className={label}>Location</label>
          {coords ? (
            <div className="text-sm text-fx-text-dim border border-fx-border px-3 py-2">
              {coords.latitude.toFixed(6)}, {coords.longitude.toFixed(6)}
            </div>
          ) : (
            <button type="button" onClick={captureLocation} disabled={locating || locked} className={plainButton}>
              {locating ? "Locating…" : "Share my current location"}
            </button>
          )}
        </div>

        {error && <div className="text-fx-red text-sm">{error}</div>}

        <button type="submit" disabled={loading || locked} className={plainButton}>
          {locked ? "Submitted" : loading ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}

/* ── 3 & 4. Suspended placeholders ──────────────────────────────────────── */
function SuspendedSection({ number, title, description }) {
  return (
    <div className={`${panel} opacity-50`}>
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-fx-border">
        <h3 className="text-lg font-semibold">{number}. {title}</h3>
        <StatusBadge status="SUSPENDED" />
      </div>
      <p className="text-fx-text-dim text-sm">{description}</p>
    </div>
  );
}

export default function KycPage() {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState("");

  const load = () => {
    authAPI.getKYC()
      .then(({ data }) => setData(data))
      .catch(() => setLoadError("Unable to load KYC status."));
  };

  useEffect(load, []);

  const refresh = () => {
    load();
    authAPI.getProfile().then(({ data: profile }) => useAuthStore.getState().setUser(profile)).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-fx-bg text-fx-text">
      <DashboardNavbar />
      <main className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-semibold mb-1">Identity Verification</h1>
        <p className="text-fx-text-dim text-sm mb-8">
          Complete the steps below to verify your account. Overall status:{" "}
          <span className="border border-fx-border px-2 py-0.5 text-xs">{data?.overall_status || "PENDING"}</span>
        </p>

        {loadError && <div className="text-fx-red text-sm mb-4">{loadError}</div>}

        <div className="space-y-6">
          <IdentitySection data={data?.identity} onSubmitted={refresh} />
          <AddressSection data={data?.address} onSubmitted={refresh} />
          <SuspendedSection
            number={3}
            title="Proof of Ownership"
            description="Verification of asset or business ownership. Not yet available."
          />
          <SuspendedSection
            number={4}
            title="Proof of Income"
            description="Verification of income source. Not yet available."
          />
        </div>
      </main>
    </div>
  );
}