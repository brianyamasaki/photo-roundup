import sharp from "sharp";
import fs from "fs-extra";
import path from "node:path";
import { glob } from "glob";
import Exif from 'node-exif';

const ExifImage = Exif.ExifImage;

const photosSrcDir = './photos';

const photosDestDir = './src/assets/photos/';

const matchString = '*.jpg';

const paths = glob.sync(`${photosSrcDir}/${matchString}`);

const getMetadata = async (path) => {
  try {
    const metadata = await sharp(path).metadata();
    return (metadata);

  } catch(error) {
    console.error(`${path} not found`);
  }
}

const kimgWidth = 1000;

// decimal from Degrees, minutes, seconds
const decFromDms = (gps) => (gps[0] + gps[1] / 60 + gps[2] / 3600)

// returns true if item passed in is an array
const isArray = (item) => ( typeof item === "object" && item.length !== undefined);

// convert gps degrees, minutes, second into decimal Latitude and Longitude
const gpsToDecimal = (gps) => {
  const errorReturn = {
    isValid: false,
    Lat: 0,
    Lng: 0
  };

  if (typeof gps !== "object") return errorReturn;
  const {GPSLatitudeRef, GPSLatitude, GPSLongitudeRef, GPSLongitude} = gps;
  if (typeof GPSLatitudeRef === "string" && typeof GPSLongitudeRef === "string" &&
    isArray(GPSLatitude) && isArray(GPSLongitude)) {
      const latSign = GPSLatitudeRef.toUpperCase() === "N" ? 1 : -1;
      const lngSign = GPSLongitudeRef.toUpperCase() === "E" ? 1 : -1;
      return {
        isValid: true,
        Lat: latSign * decFromDms(GPSLatitude),
        Lng: lngSign * decFromDms(GPSLongitude)
      }
  }
  return errorReturn;
}

const photoExifs = [];
const resizeImage = async (pathFrom, pathTo) => {
  try {
    const { name, ext } = path.parse(pathFrom);
    const imgSharp = sharp(pathFrom);

    const metadata = await imgSharp.metadata();

    imgSharp.resize({
        width: kimgWidth,
        height: Math.trunc(kimgWidth * metadata.height / metadata.width)
      })
      .toFile(`${pathTo}/${name}${ext}`);

    new ExifImage({image: pathFrom}, (error, exifData) => {
      if (error) {
        console.error(error.message);
      } else {
        // photoExifs.push({
        //   filename: name,
        //   exifData
        // });
        photoExifs.push({
          dateCreated: exifData.exif.DateTimeOriginal || exifData.exif.CreateDate,
          height: metadata.height,
          width: metadata.width,
          filename: name,
          fileExt: ext,
          image: exifData.image,
          gps: gpsToDecimal(exifData.gps)
        })
      }
    });
    
  } catch(err) {
    console.error(err);
  }
}


// will create the resized folder if it doesn't already exist
fs.ensureDirSync(photosDestDir);

paths.forEach(path => {
  resizeImage(path, photosDestDir);
})

// setTimeout necessary so everything finishes before program finishes.
setTimeout(() => {
  const filePath = `${photosDestDir}metas.json`;
  fs.writeJson(filePath, photoExifs, {
    spaces: 2
  })
    .then(() => {
      console.log('successfully wrote')
    })
    .catch(error => {
      console.log(error)
    })
}, 5000);