import json

def main():
    gates = []
    with open('./example_territory_card.txt', 'r') as f:
        for line in f:
            gate = json.loads(line)
            households = gate[3]
            gate[3] = [{
                "id": i,
                "name": x,
                "status": 0,
                "isLock": True,
            } for i, x in enumerate(households)]
            gate[2] = gate[2] if gate[2] else "정문"
            gates.append(gate)

    print(json.dumps(gates, ensure_ascii=False))

if __name__ == "__main__":
    main()