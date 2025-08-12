type Props = { url?: string; label?: string };

export function DownloadCVButton({ url, label = 'Download CV' }: Props) {
  if (!url) {
    return <button disabled className="opacity-60 cursor-not-allowed border px-3 py-2 rounded">CV not available</button>;
  }
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
       className="border px-3 py-2 rounded hover:shadow focus:outline-none">
      {label}
    </a>
  );
}
