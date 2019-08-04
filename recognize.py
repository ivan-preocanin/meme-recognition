from PIL import Image
import pytesseract
import argparse
import cv2
import os
import sys
import fileinput
from io import StringIO
from io import BytesIO

tessdata_dir_config = ""

def recognize(buf):
    img = Image.open(StringIO(buf))

    print(pytesseract.image_to_string(img, lang="eng", config=tessdata_dir_config))
    # print(sys.argv[1])


if __name__ == "__main__":
    i = ""
    for line in fileinput.input():
        i = input(line)

    recognize(i)
    # sys.stdout.write(i)
    # sys.stdout.flush()
