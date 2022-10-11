/// one item in todolist
class Task implements Comparable<Task> {
  String title;

  TaskPriorityEnum priority;

  DateTime due;

  bool needNotification;

  // sub-task list
  List<Task> children = [];

  // TODO:(fanqidi:2022/10/11) recurring detail setting
  Task({required this.title, DateTime? due, List<Task>? children,TaskPriorityEnum? priority,bool? needNotification})
      : due = due ?? DateTime.now(),children=children??[],priority=priority??TaskPriorityEnum.medium,needNotification=needNotification??false;

  @override
  int compareTo(Task other) {
    // TODO: implement compareTo: priority> due time > title
    throw UnimplementedError();
  }
}

/// priority of a task item
enum TaskPriorityEnum { high, medium, low }
