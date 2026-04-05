import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../APIs/axios";
import toast from "react-hot-toast";
import {
  IndianRupee,
  Clock,
  CheckCircle,
  Shield,
  ArrowLeft,
  Loader,
  CreditCard,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

const statusColors = {
  PENDING: "bg-orange-50 text-orange-600 border-orange-100",
  SUCCESS: "bg-emerald-50 text-emerald-600 border-emerald-100",
  FAILED: "bg-red-50 text-red-600 border-red-100",
};

const Payment = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: bookingData } = await api.get(`/user/booking/${bookingId}`);
        setBooking(bookingData);

        try {
          const { data: paymentData } = await api.get(`/user/payment/booking/${bookingId}`);
          setPayment(paymentData);
        } catch { /* No payment yet */ }
      } catch {
        toast.error("Failed to load booking details");
        navigate("/user/bookings");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [bookingId]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      const { data: newPayment } = await api.post("/user/payment/create-order/" + bookingId);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: newPayment.amount,
        currency: "INR",
        name: "Serviz",
        description: `Booking #${bookingId}`,
        order_id: newPayment.razorpayOrderId,
        handler: async (response) => {
          try {
            const { data: verified } = await api.post("/user/payment/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setPayment(verified);
            await api.put(`/user/requests/${booking.bid.serviceRequest.id}/complete`);
            toast.success("Payment successful! 🎉");
          } catch {
            toast.error("Payment verification failed");
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          email: booking?.user?.email,
          contact: booking?.user?.phone,
        },
        theme: { color: "#7C3AED" }, // Purple theme for Razorpay
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast("Payment cancelled", { icon: "⚠️" });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-10 h-10 border-[3px] border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (!booking) return null;

  const isPaid = payment?.status === "SUCCESS";

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      {/* Header & Back */}
      <div className="flex flex-col gap-6">
        <button onClick={() => navigate("/user/bookings")}
          className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-purple-600 transition-colors w-fit group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Bookings
        </button>
        
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Booking Summary */}
        <div className="glass rounded-4xl border border-white/50 p-8 shadow-sm space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16" />
          
          <div className="relative">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Booking Details</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Type</p>
                  <p className="text-lg font-black text-slate-900 capitalize">
                    {booking.bid?.serviceRequest?.serviceType?.replace("_", " ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider</p>
                  <p className="text-lg font-black text-slate-900">{booking.provider?.name}</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-6 border-y border-slate-100/50">
                
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-50 rounded-xl">
                    <IndianRupee size={20} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Service Fee</p>
                    <p className="text-sm font-black text-slate-900">₹{booking.bid?.price?.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xl font-black text-slate-900">Total to Pay</span>
                <div className="flex items-center gap-1 text-3xl font-black text-purple-600 tracking-tighter">
                  <IndianRupee size={24} strokeWidth={3} />
                  {booking.bid?.price?.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Logic */}
        {!isPaid ? (
          <div className="space-y-6">
            {/* Payment Status (if failed/pending) */}
            {payment && payment.status !== "SUCCESS" && (
              <div className={`glass rounded-3xl border p-5 flex items-center gap-4 ${statusColors[payment.status] || "bg-slate-50 border-slate-100 text-slate-600"}`}>
                <AlertCircle size={20} />
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">Payment {payment.status}</p>
                  <p className="text-xs font-bold opacity-70 mt-0.5">Please try again to confirm your booking</p>
                </div>
              </div>
            )}

            {/* Pay Card */}
            <div className="glass rounded-4xl border border-white/50 p-8 shadow-sm space-y-8">
              <button
                onClick={handlePayment}
                disabled={processing || booking.status !== "SCHEDULED"}
                className="btn-primary w-full py-5 text-sm uppercase tracking-[0.2em] shadow-purple-200/50 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
              >
                {processing ? (
                  <div className="w-5 h-5 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard size={20} strokeWidth={2.5} />
                    Confirm & Pay ₹{booking.bid?.price?.toLocaleString()}
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6">
                <div className="flex items-center gap-1.5 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                  <ShieldCheck size={14} className="text-slate-900" />
                  <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Secured by Razorpay</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="glass rounded-[3rem] border-2 border-emerald-500/20 bg-emerald-50/20 p-12 flex flex-col items-center text-center shadow-xl shadow-emerald-50/50 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -mr-32 -mt-32 animate-pulse" />
            
            <div className="w-24 h-24 bg-white rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-emerald-200 border border-emerald-100 relative group">
              <div className="absolute inset-0 bg-emerald-500 rounded-[2.5rem] scale-0 group-hover:scale-100 transition-transform duration-500 opacity-10" />
              <CheckCircle size={48} className="text-emerald-500" strokeWidth={2.5} />
            </div>

            <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Payment Successful</h3>
            
              

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="glass bg-white/60 p-5 rounded-3xl border border-white flex flex-col items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transaction ID</p>
                  <p className="text-xs font-bold text-slate-700 font-mono truncate w-full text-center">
                    {payment.razorpayPaymentId}
                  </p>
               </div>
               <div className="glass bg-white/60 p-5 rounded-3xl border border-white flex flex-col items-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Paid on</p>
                  <p className="text-xs font-bold text-slate-700">
                    {new Date(payment.paidAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' })}
                  </p>
               </div>
            </div>

            <button
              onClick={() => navigate("/user/bookings")}
              className="btn-primary mt-12 w-full py-4 text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              Go to My Bookings <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payment;
