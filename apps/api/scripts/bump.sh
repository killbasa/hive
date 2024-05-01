#! /bin/sh

download_path="./bin/yt-dlp"

curl -L -sSf https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o $download_path
chmod +x $download_path

echo "yt-dlp updated to $($download_path --version)"
