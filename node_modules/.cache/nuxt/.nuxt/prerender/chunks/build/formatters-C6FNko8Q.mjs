function formatDate(date, options) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", options || {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
function formatDateShort(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}
function formatDateTime(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function formatRelativeTime(date) {
  if (!date) return "";
  const now = /* @__PURE__ */ new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1e3);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateShort(date);
}
function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function truncate(text, length = 150) {
  if (!text) return "";
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + "...";
}
function formatSalary(min, max, currency = "USD", visible = true) {
  if (!visible) return "Salary not disclosed";
  if (!min && !max) return "Negotiable";
  const formatter = new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 });
  if (min && max) return `${formatter.format(min)} – ${formatter.format(max)}`;
  if (min) return `From ${formatter.format(min)}`;
  return `Up to ${formatter.format(max)}`;
}
function formatJobType(type) {
  const map = {
    full_time: "Full Time",
    part_time: "Part Time",
    contract: "Contract",
    internship: "Internship",
    freelance: "Freelance"
  };
  return map[type] || type;
}

export { formatSalary as a, formatDateShort as b, formatDate as c, formatDateTime as d, formatRelativeTime as e, formatJobType as f, slugify as s, truncate as t };
//# sourceMappingURL=formatters-C6FNko8Q.mjs.map
