export const getBiasColor = (score) => {
  if (score < 30)
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      dot: "bg-emerald-500",
      ring: "ring-emerald-500/20",
    };
  if (score < 60)
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      ring: "ring-amber-500/20",
    };
  return {
    bg: "bg-rose-50",
    text: "text-rose-700",
    dot: "bg-rose-500",
    ring: "ring-rose-500/20",
  };
};

export const getBiasLabel = (score) => {
  if (score < 30) return "Minimal Bias Detected";
  if (score < 60) return "Moderate Bias Present";
  return "High Bias Detected";
};

export const getCredibilityColor = (score) => {
  if (score >= 85)
    return {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      icon: "text-emerald-600",
    };
  if (score >= 70)
    return {
      bg: "bg-amber-50",
      text: "text-amber-700",
      icon: "text-amber-600",
    };
  return { bg: "bg-rose-50", text: "text-rose-700", icon: "text-rose-600" };
};

export const getCredibilityLabel = (score) => {
  if (score >= 85) return "Highly Credible";
  if (score >= 70) return "Moderately Credible";
  return "Low Credibility";
};

export const getSourceBiasColor = (bias) => {
  if (bias === "left") return "bg-rose-500";
  if (bias === "center") return "bg-gray-500";
  return "bg-blue-600";
};

export const getFactCheckStatus = (status) => {
  if (status === "verified")
    return {
      icon: "CheckCircle",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      label: "Verified",
    };
  if (status === "partially-true")
    return {
      icon: "AlertTriangle",
      color: "text-amber-600",
      bg: "bg-amber-50",
      label: "Partially True",
    };
  return {
    icon: "XCircle",
    color: "text-rose-600",
    bg: "bg-rose-50",
    label: "False",
  };
};
