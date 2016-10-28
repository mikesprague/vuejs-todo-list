Vue.filter( "timeago", function( date ) {
  return new timeago().format( date );
});

Vue.component( "todo-list", {
  template: "#todo-list-template",
  data: function() {
    return {
      newTask: "",
      tasks: [
        {
          task: "Do something",
          priority: 2,
          created: Date.now(),
          completed: false
        },
        {
          task: "Do something else",
          priority: 1,
          created: Date.now(),
          completed: true
        }
      ],
      defaultSortBy: [ "priority", "created" ],
      defaultSortOrder: [ "asc", "desc" ],
      defaultTaskPriority: 2 // 1: high, 2: normal. 3: low
    }
  },
  created: function() {
    if ( localStorage.todoData ) {
      this.tasks = this.getData( "todoData" );
    } else {
      this.initApp();
    }
  },
  mounted: function() {
    new timeago().render( document.querySelectorAll( ".timeago" ) );
  },
  methods: {
    togglePriority: function( task, priority ) {
      task.updated = Date.now();
      task.priority = priority;
      this.sortTasks( this.defaultSortBy, this.defaultSortOrder );
      this.setData( "todoData", this.tasks );
    },
    toggleTodoStatus: function( task ) {
      task.updated = Date.now();
      task.completed = !task.completed;
      this.setData( "todoData", this.tasks );
    },
    sortTasks: function( sortBy, sortOrder ) {
      this.tasks = _.orderBy( this.tasks, sortBy, sortOrder );
    },
    deleteTodo: function( task ) {
      task.updated = Date.now();
      this.tasks.splice( this.tasks.indexOf( task ), 1 );
      this.setData( "todoData", this.tasks );
    },
    addTodo: function() {
      if ( this.newTask.trim().length ) {
        this.tasks.push({
          task: this.newTask,
          priority: this.defaultTaskPriority,
          created: Date.now(),
          completed: false
        });
        this.$nextTick( function() {
          new timeago().render( document.querySelectorAll( ".timeago" ) );
        });
        this.newTask = "";
        this.setData( "todoData", this.tasks );
      } else {
        this.newTask = "";
      }
    },
    isComplete: function( task ) {
      return task.completed;
    },
    notComplete: function( task ) {
      return !this.isComplete( task );
    },
    clearCompleted: function() {
      this.tasks = this.tasks.filter( this.notComplete );
      this.setData( "todoData", this.tasks );
    },
    setData: function( key, data ) {
      var todoData = JSON.stringify( data );
      localStorage.setItem( key, todoData );
    },
    getData: function( key ) {
      var todoData = localStorage.getItem( key );
      return JSON.parse( todoData );
    },
    resetApp: function() {
      this.tasks = this.getData( "originalData" );
      this.initApp();
    },
    initApp: function() {
      localStorage.clear();
      this.setData( "originalData", this.tasks );
      this.sortTasks( this.defaultSortBy, this.defaultSortOrder );
      this.setData( "todoData", this.tasks );
      new timeago().render( document.querySelectorAll( ".timeago" ) );
    }
  },
  computed: {
    completedTasks: function() {
      if ( this.tasks ) {
        return this.tasks.filter( this.isComplete).length;
      }
    },
    remainingTasks: function() {
      if ( this.tasks ) {
        return this.tasks.filter( this.notComplete).length;
      }
    },
    totalTasks: function() {
      if ( this.tasks ) {
        return this.tasks.length;
      }
    }
  }
});

var app = new Vue({
  el: "#app"
});
