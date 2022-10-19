import 'dart:math';

/// one item in todolist
class Task implements Comparable<Task> {
  final int id;

  String title;

  TaskPriorityEnum priority;

  DateTime due, createdAt, updatedAt;

  bool needNotification;

  // sub-task list
  List<Task> children = [];

  // TODO:(fanqidi:2022/10/11) recurring detail setting
  Task(
      {required this.title,
      DateTime? due,
      DateTime? createdAt,
      DateTime? updatedAt,
      List<Task>? children,
      TaskPriorityEnum? priority,
      bool? needNotification})
      : due = due ?? DateTime.now(),
        createdAt = createdAt ?? DateTime.now(),
        updatedAt = updatedAt ?? DateTime.now(),
        children = children ?? [],
        priority = priority ?? TaskPriorityEnum.medium,
        needNotification = needNotification ?? false,
        id = Object.hash(title, due, Random().nextBool());

  @override
  int compareTo(Task other) {
    // TODO: implement compareTo: priority> due time > title
    throw UnimplementedError();
  }
}

/// priority of a task item
enum TaskPriorityEnum { high, medium, low }
