import re
import json

def main():

    polygon_path = []
    with open('./polygon_example') as f:
        for line in f:
            tstr = line.strip()
            tstr = re.sub("POLYGON\(\(", "", tstr)
            tstr = re.sub("\)\)", "", tstr)

            splits = tstr.split(',')
            for location in splits:
                lat, lng = tuple(location.split(" "))
                polygon_path.append({
                    "lat": float(lat),
                    "lng": float(lng),
                })

    print(json.dumps(polygon_path))

if __name__ == "__main__":
    main()