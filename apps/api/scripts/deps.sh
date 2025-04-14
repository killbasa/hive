#! /bin/sh

scriptdir="$(dirname "$0")"
cd "$(dirname $scriptdir)"

# yt-dlp
ytdlp_url="https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp"
ytdlp_path="./bin/yt-dlp"

if [[ ! -e "./bin" ]]; then
    mkdir "./bin"
fi

wget $ytdlp_url -O $ytdlp_path

chmod +x $ytdlp_path
echo "yt-dlp updated to $($ytdlp_path --version)"

if [ "$(uname)" == "Darwin" ]; then
	# ref: https://github.com/yt-dlp/FFmpeg-Builds/issues/67
	echo "FFMpeg builds not available for MacOS"
	exit 0
fi

# ffmpeg
ffmpeg_dl_name="ffmpeg-master-latest-linux64-gpl"
ffmpeg_url="https://github.com/yt-dlp/FFmpeg-Builds/releases/download/latest/$ffmpeg_dl_name.tar.xz"
ffmpeg_path="./bin/ffmpeg"
ffprobe_path="./bin/ffprobe"

wget $ffmpeg_url -O ./bin/$ffmpeg_dl_name.tar.xz

tar -xf ./bin/$ffmpeg_dl_name.tar.xz -C ./bin

mv ./bin/$ffmpeg_dl_name/bin/ffmpeg $ffmpeg_path
mv ./bin/$ffmpeg_dl_name/bin/ffprobe $ffprobe_path

chmod +x $ffmpeg_path
chmod +x $ffprobe_path

rm -r ./bin/$ffmpeg_dl_name.tar.xz
rm -r ./bin/$ffmpeg_dl_name

echo "ffmpeg updated to $($ffmpeg_path -version)"
