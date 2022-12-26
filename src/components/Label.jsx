const Label = ({ label, htmlFor, required, errorMsg }) => {
  return (
    <label htmlFor={htmlFor} className="input-label">
      <span>{label}</span>
      {required && <span className="text-red-500">*</span>}
      {!!errorMsg && <span className="text-red-500 text-xs">{errorMsg}</span>}
    </label>
  );
};

export default Label;
