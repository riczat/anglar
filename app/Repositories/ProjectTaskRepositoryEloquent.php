<?php

namespace App\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use App\Repositories\ProjectTaskRepository;
use App\Entities\ProjectTask;

/**
 * Class ProjectTaskRepositoryEloquent
 * @package namespace App\Repositories;
 */
class ProjectTaskRepositoryEloquent extends BaseRepository implements ProjectTaskRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ProjectTask::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
    
    public function presenter()
    {
        return ProjectTasksPresenter::class;
    }
}
