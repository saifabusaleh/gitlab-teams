import Gitlab from "@/services/gitlab";
import notification from "@/services/notification";

let gitlabApi = null;

function init(store) {
  gitlabApi = new Gitlab.Api({
    apiEndpoint: store.state.settings.apiEndpoint,
    apiToken: store.state.settings.apiToken
  });

  gitlabApi.on("pipeline-failed", ({ pipeline }) => {
    notification.notify("pipeline-failed", `Pipeline ${pipeline.id} failed`);
  });

  gitlabApi.on("new-merge-request", mr => {
    store.dispatch("fetchTeamProject", mr.project_id).then(() => {
      store.dispatch("addMergeRequest", mr);
    });
  });

  gitlabApi.on("updated-pipeline", ({ mergeRequest, pipeline }) => {
    store.dispatch("updatePipeline", { mergeRequest, pipeline });
  });

  gitlabApi.on("updated-merge-request", mr => {
    store.dispatch("updateMergeRequest", mr);
  });

  gitlabApi.on("merged-merge-request", mr => {
    store.dispatch("removeMergeRequest", mr);
  });

  gitlabApi.on("new-todo", todo => {
    store.dispatch("addTodo", todo);
  });

  gitlabApi.on("todo-length", length => {
    store.dispatch("setTodoSize", length);
  });

  gitlabApi.on("new-issue", issue => {
    store.dispatch("fetchTeamProject", issue.project_id).then(() => {
      store.dispatch("addIssue", issue);
    });
  });

  gitlabApi.on("issue-length", length => {
    store.dispatch("setIssueSize", length);
  });

  gitlabApi.on("new-project", project => {
    store.dispatch("addProject", project);
  });

  gitlabApi.on("project-length", length => {
    store.dispatch("setProjectSize", length);
  });

  gitlabApi.on("new-runner", runner => {
    store.dispatch("addRunner", runner);
  });
}

function get() {
  return gitlabApi;
}

export default {
  get,
  init
};
