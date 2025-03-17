import argparse
import subprocess
import speech_recognition as sr
from fpdf import FPDF

def extract_audio(video_path, audio_path):
    command = f"ffmpeg -i {video_path} -q:a 0 -map a {audio_path} -y"
    subprocess.run(command, shell=True)

def transcribe_audio(audio_path):
    recognizer = sr.Recognizer()
    with sr.AudioFile(audio_path) as source:
        audio = recognizer.record(source)
    return recognizer.recognize_google(audio)

def save_to_pdf(text, output_path):
    pdf = FPDF()
    pdf.set_auto_page_break(auto=True, margin=15)
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0, 10, text)
    pdf.output(output_path)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Convert video to PDF notes")
    parser.add_argument("--input", required=True, help="Input video file")
    parser.add_argument("--output", required=True, help="Output PDF file")
    args = parser.parse_args()

    audio_file = "temp_audio.wav"
    extract_audio(args.input, audio_file)
    text = transcribe_audio(audio_file)
    save_to_pdf(text, args.output)
    print(f"PDF saved as {args.output}")
