import math
import typing

from shapely.ops import nearest_points

from model.algorithm_jts import LineSegment
from model.building.base_residence_building import BaseResidenceBuilding


def get_nearest_distance_line_of_buildings(first_building: BaseResidenceBuilding,
                                           second_building: BaseResidenceBuilding) -> typing.Union[LineSegment, None]:
    """
    计算直线最近距离的间距线
    :param first_building:
    :param second_building:
    :return:
    """
    if first_building.geometry.intersects(second_building.geometry):
        return None
    p1, p2 = nearest_points(first_building.geometry, second_building.geometry)
    return LineSegment(p1.x, p1.y, p2.x, p2.y)


def get_vertical_distance_line_of_buildings(first_building: BaseResidenceBuilding,
                                            second_building: BaseResidenceBuilding) -> typing.Union[LineSegment, None]:
    if first_building.geometry.intersects(second_building.geometry):
        return None
    b1_min_x, b2_min_x = first_building.west_limit, second_building.west_limit
    b1_max_x, b2_max_x = first_building.east_limit, second_building.east_limit
    if b1_min_x > b2_max_x or b1_max_x < b2_min_x:
        # 没有y方向上的重叠面
        return None
    else:
        min_distance = float("inf")
        min_distance_line = None
        first_building_line_segments = LineSegment.get_line_segments_of_polygon_exterior(
            first_building.geometry_simplified)
        second_building_line_segments = LineSegment.get_line_segments_of_polygon_exterior(
            second_building.geometry_simplified)
        all_segments = first_building_line_segments + second_building_line_segments
        for i, building_line_segment in enumerate(all_segments):
            is_vertical = building_line_segment.is_vertical()
            min_y, max_y = building_line_segment.min_y, building_line_segment.max_y
            other_building = second_building if i < len(first_building_line_segments) else first_building
            for coord in other_building.geometry_simplified.boundary.coords:
                x, y = coord[0], coord[1]
                if is_vertical and x == building_line_segment.x0:
                    if y < min_y:
                        y_distance = min_y - y
                        if y_distance < min_distance:
                            min_distance = y_distance
                            min_distance_line = LineSegment(x, y, x, min_y)
                    else:
                        y_distance = y - max_y
                        if y_distance < min_distance:
                            min_distance = y_distance
                            min_distance_line = LineSegment(x, y, x, max_y)
                if not is_vertical:
                    # 非垂直
                    coordinate = building_line_segment.get_coordinate_of_given_x(x)
                    if coordinate is not None:
                        x1: float = coordinate[0]
                        y1: float = coordinate[1]
                        line = LineSegment(x, y, x1, y1)
                        if line.length < min_distance:
                            min_distance = line.length
                            min_distance_line = line
        return min_distance_line


def get_horizontal_distance_line_of_buildings(first_building: BaseResidenceBuilding,
                                              second_building: BaseResidenceBuilding) -> typing.Union[LineSegment, None]:
    if first_building.geometry.intersects(second_building.geometry):
        return None
    b1_min_y, b2_min_y = first_building.south_limit, second_building.south_limit
    b1_max_y, b2_max_y = first_building.north_limit, second_building.north_limit
    if b1_min_y > b2_max_y or b1_max_y < b2_min_y:
        # 没有x方向上的重叠面
        return None
    else:
        min_distance = float("inf")
        min_distance_line = None
        first_building_line_segments = LineSegment.get_line_segments_of_polygon_exterior(
            first_building.geometry_simplified)
        second_building_line_segments = LineSegment.get_line_segments_of_polygon_exterior(
            second_building.geometry_simplified)
        all_segments = first_building_line_segments + second_building_line_segments
        for i, building_line_segment in enumerate(all_segments):
            is_horizontal = building_line_segment.is_horizontal()
            min_x, max_x = building_line_segment.min_x, building_line_segment.max_x
            other_building = second_building if i < len(first_building_line_segments) else first_building
            for coord in other_building.geometry_simplified.boundary.coords:
                x, y = coord[0], coord[1]
                if is_horizontal and y == building_line_segment.y0:
                    if x < min_x:
                        x_distance = min_x - x
                        if x_distance < min_distance:
                            min_distance = x_distance
                            min_distance_line = LineSegment(x, y, min_x, y)
                    else:
                        x_distance = x - max_x
                        if x_distance < min_distance:
                            min_distance = x_distance
                            min_distance_line = LineSegment(x, y, max_x, y)
                if not is_horizontal:
                    # 非平行
                    coordinate = building_line_segment.get_coordinate_of_given_y(y)
                    if coordinate is not None:
                        x1: float = coordinate[0]
                        y1: float = coordinate[1]
                        line = LineSegment(x, y, x1, y1)
                        if line.length < min_distance:
                            min_distance = line.length
                            min_distance_line = line
        return min_distance_line


def get_regulation_line_of_buildings(object_building: BaseResidenceBuilding,
                                     subject_building: BaseResidenceBuilding) -> typing.Union[LineSegment, None]:
    """
    计算遮挡建筑和被遮挡建筑的间距线，返回最短的一条
    :param object_building:
    :param subject_building:
    :return:
    """
    if subject_building.geometry.intersects(object_building.geometry):
        return None
    # 重叠的建筑
    if object_building.south_limit > subject_building.north_limit:
        # 遮挡建筑在被遮挡建筑的北边
        return None
    if object_building.geometry.intersects(subject_building.geometry):
        return None
    # 从主体建筑（被遮挡建筑）的采光面出发，研究他们被遮挡的距离
    coordinate_system_list = subject_building.lighting_faces_coordinate_system_list
    current_line: LineSegment = None
    for coordinate_system in coordinate_system_list:
        angle = coordinate_system.y_direction_normal.angle
        if 180 > angle > 0:
            # 被遮挡建筑采光面正向朝北的时候，不需要计算遮挡线段
            continue
        line_segment = coordinate_system.data
        # 遮挡建筑的轮廓，换到新的坐标系中
        original_coords = list(object_building.geometry_simplified.exterior.coords)
        new_coords = coordinate_system.transform_coord_list(original_coords)
        maxy = max([coord[1] for coord in new_coords])
        if maxy <= 0:
            # 所有的点都不在正向投影内，跳过
            continue
        x_min, x_max = -line_segment.length / 2, line_segment.length / 2
        for i in range(len(new_coords) - 1):
            x0, y0 = new_coords[i]
            x1, y1 = new_coords[i + 1]
            if max(x0, x1) < x_min or min(x0, x1) > x_max:
                # 不在正向投影内
                continue
            else:
                line_segment = LineSegment(x0, y0, x1, y1)
                k = math.tan(line_segment.radians)
                # 斜率大于0，那么取最左边的点，否则取最右边的
                if abs(k) > 1e6:
                    # k很大的时候，两个面接近垂直，垂直的时候不算距离
                    continue
                if k > 0:
                    x = max(x_min, min(x0, x1))
                elif k < 0:
                    x = min(x_max, max(x0, x1))
                else:
                    # k = 0
                    # 平行的时候， 取中点
                    x = (x_min + x_max) / 2
                # 代入公式(y-y0)=k(x-x0)求y
                y = y0 + k * (x - x0)
                foot_line = LineSegment(x, 0, x, y)
                if current_line is None or foot_line.length < current_line.length:
                    # 要把这个线段翻译回去
                    original_x0, original_y0 = coordinate_system.get_original_coordinate(x, 0)
                    original_x1, original_y1 = coordinate_system.get_original_coordinate(x, y)
                    original_foot_line = LineSegment(original_x0, original_y0, original_x1, original_y1)
                    current_line = original_foot_line
    return current_line
