export default function WithdrawalStatusModal({ status, onClose }) {
  if (!status) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-fx-panel rounded-2xl p-8 max-w-sm w-full mx-4 text-center shadow-xl">
        {status === "processing" && (
          <>
            <svg className="mx-auto w-16 h-16 animate-spin text-fx-teal" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <h2 className="text-lg font-semibold mt-4">Processing withdrawal…</h2>
            <p className="text-fx-text-dim text-sm mt-2">
              Hang tight, we're submitting your request.
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-fx-teal/10 flex items-center justify-center wsm-pop">
              <svg className="w-9 h-9 text-fx-teal" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 13l4 4L19 7"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="wsm-draw"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold mt-4">Withdrawal initiated</h2>
            <p className="text-fx-text-dim text-sm mt-2">
              Your request has been submitted and will be processed shortly.
            </p>
            <button onClick={onClose} className="btn-teal mt-6 w-full">
              Done
            </button>
          </>
        )}

        <style>{`
          .wsm-pop { animation: wsmPop 0.25s ease-out; }
          @keyframes wsmPop {
            from { transform: scale(0.6); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .wsm-draw {
            stroke-dasharray: 24;
            stroke-dashoffset: 24;
            animation: wsmDraw 0.4s ease-out 0.1s forwards;
          }
          @keyframes wsmDraw {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}