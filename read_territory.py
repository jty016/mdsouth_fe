import json


def main():
    gates = []
    with open('./example_territory_card.txt', 'r') as f:
        for i, line in enumerate(f):
            gate = json.loads(line)
            gates.append({
                "id": i,
                "address": gate[0],
                "buildingName": gate[1],
                "gateName": gate[2] if gate[2] else "정문",
                "households": [{
                    "id": i,
                    "name": x,
                    "status": 0,
                    "isLock": True,
                } for i, x in enumerate(gate[3])],
            })

    print(json.dumps(gates, ensure_ascii=False))


if __name__ == "__main__":
    main()
