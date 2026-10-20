import os
import cv2
import numpy as np
from PIL import Image

def generate_video():
    artifact_dir = r"C:\Users\k3019\.gemini\antigravity-ide\brain\ac86e054-00a3-4b94-a43a-3807ed1fbcc7"
    
    # Screenshots in chronological demo order
    image_files = [
        os.path.join(artifact_dir, "landing_page_1792521158024.png"),
        os.path.join(artifact_dir, "food_recognition_page_1792521209770.png"),
        os.path.join(artifact_dir, "food_recognition_results_1792521420148.png"),
        os.path.join(artifact_dir, "freshness_page_1792521517385.png"),
        os.path.join(artifact_dir, "freshness_results_1792522097660.png")
    ]

    # Target resolution
    target_w, target_h = 1280, 720
    fps = 30
    duration_per_slide_sec = 4
    transition_frames = 15

    frames_per_slide = fps * duration_per_slide_sec

    # Load and resize images to fit 1280x720 with aspect ratio preservation & letterboxing
    processed_images = []
    for path in image_files:
        if not os.path.exists(path):
            continue
        img = Image.open(path).convert("RGB")
        # Scale to fit
        img.thumbnail((target_w, target_h), Image.Resampling.LANCZOS)
        # Create canvas
        canvas = Image.new("RGB", (target_w, target_h), (253, 251, 247))
        # Center image
        offset_x = (target_w - img.width) // 2
        offset_y = (target_h - img.height) // 2
        canvas.paste(img, (offset_x, offset_y))
        
        cv_img = cv2.cvtColor(np.array(canvas), cv2.COLOR_RGB2BGR)
        processed_images.append(cv_img)

    if not processed_images:
        print("No images found to compile.")
        return

    # Output paths
    public_mp4 = r"d:\food-verse-ai\frontend\public\food_verse_demo.mp4"
    artifact_mp4 = os.path.join(artifact_dir, "food_verse_demo.mp4")
    artifact_webp = os.path.join(artifact_dir, "food_verse_demo.webp")
    public_webp = r"d:\food-verse-ai\frontend\public\food_verse_demo.webp"

    os.makedirs(os.path.dirname(public_mp4), exist_ok=True)

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(public_mp4, fourcc, fps, (target_w, target_h))

    all_pil_frames = []

    for i, curr_img in enumerate(processed_images):
        # Hold frame
        for _ in range(frames_per_slide):
            out.write(curr_img)
            # Sample 2 fps for webp animation to keep filesize light
            if _ % 15 == 0:
                all_pil_frames.append(Image.fromarray(cv2.cvtColor(curr_img, cv2.COLOR_BGR2RGB)))

        # Crossfade transition to next
        if i < len(processed_images) - 1:
            next_img = processed_images[i + 1]
            for f in range(transition_frames):
                alpha = f / float(transition_frames)
                blended = cv2.addWeighted(curr_img, 1.0 - alpha, next_img, alpha, 0)
                out.write(blended)
                if f % 5 == 0:
                    all_pil_frames.append(Image.fromarray(cv2.cvtColor(blended, cv2.COLOR_BGR2RGB)))

    out.release()
    print(f"Generated MP4: {public_mp4}")

    # Copy to artifact dir
    import shutil
    shutil.copyfile(public_mp4, artifact_mp4)
    print(f"Copied MP4 to artifact: {artifact_mp4}")

    # Also save animated WebP
    if all_pil_frames:
        all_pil_frames[0].save(
            public_webp,
            save_all=True,
            append_images=all_pil_frames[1:],
            duration=500,
            loop=0
        )
        shutil.copyfile(public_webp, artifact_webp)
        print(f"Generated WebP: {public_webp}")

if __name__ == "__main__":
    generate_video()
