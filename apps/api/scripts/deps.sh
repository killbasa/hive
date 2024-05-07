#! /bin/sh

# yt-dlp
ytdlp_url="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp"
ytdlp_path="./bin/yt-dlp"

wget $ytdlp_url -O $ytdlp_path

chmod +x $ytdlp_path
echo "yt-dlp updated to $($ytdlp_path --version)"

# ffmpeg
ffmpeg_url="https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-linux64-gpl.tar.xz"
ffmpeg_path="./bin/ffmpeg"
ffmpeg_dl_name="ffmpeg-master-latest-linux64-gpl"

wget $ffmpeg_url -O ./bin/$ffmpeg_dl_name.tar.xz

tar -xf ./bin/$ffmpeg_dl_name.tar.xz -C ./bin

mv ./bin/$ffmpeg_dl_name/bin/ffmpeg ./bin/ffmpeg
mv ./bin/$ffmpeg_dl_name/bin/ffprobe ./bin/ffprobe

chmod +x ./bin/ffmpeg
chmod +x ./bin/ffprobe

rm -r ./bin/$ffmpeg_dl_name.tar.xz
rm -r ./bin/$ffmpeg_dl_name

echo "ffmpeg updated to $($ffmpeg_path -version)"
