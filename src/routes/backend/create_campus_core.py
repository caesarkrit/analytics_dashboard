import json

# Load the JSON data from 'data.json'
with open('data.json') as file:
    data = json.load(file)


def get_site_id(node):
    return node.get("additionalInfo", {}).get("siteid", "defaultSite")

def is_core_device(device):
    # This example assumes core devices are identified by a certain role; adjust as necessary.
    return device.get("role") == "CORE"

def is_access_device(device):
    # This example assumes access devices are identified by a certain role; adjust as necessary.
    return device.get("role") == "ACCESS"


def generate_campus_core(nodes, links):
    campus_core = {"version": "1.0", "nodes": [], "links": []}

    node_site_ids = {node["id"]: get_site_id(node) for node in nodes}
    
    for node in nodes:
        if is_core_device(node):
            campus_core["nodes"].append({
                "deviceType": node["deviceType"],
                "label": node["label"],
                "id": node["id"],
                "siteId": node_site_ids[node["id"]]
            })

    for link in links:
        source_site_id = node_site_ids.get(link["source"])
        target_site_id = node_site_ids.get(link["target"])
        if source_site_id and target_site_id and source_site_id == target_site_id:
            campus_core["links"].append({
                "source": link["source"],
                "target": link["target"],
                "siteId": source_site_id,
                "portSpeed": link.get("startPortSpeed", "unknown"),
                "status": link["linkStatus"],
                "sourcePortId": link.get("startPortID", "unknown"),
                "targetPortId": link.get("endPortID", "unknown")
            })

    return campus_core



def generate_building_connections(nodes, links):
    buildings = {}
    
    for node in nodes:
        if is_access_device(node):
            site_id = get_site_id(node)
            if site_id not in buildings:
                buildings[site_id] = {"buildingId": site_id, "nodes": [], "links": []}
            buildings[site_id]["nodes"].append({
                "deviceType": node["deviceType"],
                "label": node["label"],
                "id": node["id"]
            })
    
    # Assuming links are between access devices; adjust logic as necessary
    for link in links:
        site_id = get_site_id(nodes[0])  # Simplified; adjust as necessary
        if site_id in buildings:
            buildings[site_id]["links"].append({
                "source": link["source"],
                "target": link["target"],
                "portSpeed": link.get("startPortSpeed", "unknown"),
                "status": link["linkStatus"]
            })
    
    return {"version": "1.0", "buildings": list(buildings.values())}


def generate_info_box(nodes):
    info_box = {"version": "1.0", "devices": []}
    
    for node in nodes:
        info_box["devices"].append({
            "id": node["id"],
            "deviceType": node["deviceType"],
            "label": node["label"],
            "ip": node["ip"],
            "softwareVersion": node["softwareVersion"],
            "siteId": get_site_id(node)
        })
    
    return info_box


# Generate the JSON structures
campus_core = generate_campus_core(data["response"]["nodes"], data["response"]["links"])
building_connections = generate_building_connections(data["response"]["nodes"], data["response"]["links"])
info_box = generate_info_box(data["response"]["nodes"])

# Save to files
with open("campus_core.json", "w") as cc_file:
    json.dump(campus_core, cc_file, indent=4)

with open("building_connections.json", "w") as bc_file:
    json.dump(building_connections, bc_file, indent=4)

with open("info_box.json", "w") as ib_file:
    json.dump(info_box, ib_file, indent=4)
