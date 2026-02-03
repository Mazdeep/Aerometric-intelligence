interface Props {
  message: string;
  onRetry: () => void;
}

export function ErrorScreen({ message, onRetry }: Props) {
  return (
    <div className="error-screen" role="alert">
      <div>
        <h2>Unable to fetch METARs</h2>
        <p className="muted">{message}</p>
        <button className="btn" onClick={onRetry}>Retry</button>
      </div>
    </div>
  );
}

export default ErrorScreen;
