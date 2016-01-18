<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\ProjectTaskRepository;
use App\Services\ProjectTaskService;

class ProjectTaskController extends Controller {

    private $repository;
    private $service;

    public function __construct(ProjectTaskRepository $repository, ProjectTaskService $sevice) {
        $this->repository = $repository;
        $this->service = $sevice;
    }

    public function store(Request $request) {

        return $this->service->create($request->all());
    }

    public function show($projectId, $id) {
        return $this->repository->find($id)->where('id', $id)->where('project_id', $projectId)->get();
    }

    public function update(Request $request) {
        return $this->service->update($request->all(), $request->id);
    }

    public function destroy(Request $request) {
        return (string) $this->repository->delete($request->id);
    }

}
