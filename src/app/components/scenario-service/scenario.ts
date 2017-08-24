export class Scenario {
    id: string;
    name: string;
    file_name: string;
    json_file: string;
    date_modified: number;
    resources: object;
    sites: object;
}

export class TimeToFailure {
    scenario: string;
    key: string;
    data: string;
    x_axis_label: string;
    y_axis_label: string;
}

export class MapData {
    name: string;
    resources: object;
    assets: object;
    sites: object;
    risk_areas: object;
    routes: object;
}

export class Perspective {
    name: string;
    id: number;
}
