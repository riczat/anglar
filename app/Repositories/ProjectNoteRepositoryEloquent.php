<?php

namespace app\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use app\Repositories\ProjectNoteRepository;
use app\Entities\ProjectNote;
/**
 * Class ProjectNoteRepositoryEloquent
 * @package namespace app\Repositories;
 */
class ProjectNoteRepositoryEloquent extends BaseRepository implements ProjectNoteRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ProjectNote::class;
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
        return ProjectNotePresenter::class;
    }
}
