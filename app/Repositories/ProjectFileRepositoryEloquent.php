<?php

namespace App\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use App\Entities\ProjectFile;
/**
 * Class PorjectFileRepositoryEloquent
 * @package namespace App\Repositories;
 */
class ProjectFileRepositoryEloquent extends BaseRepository implements ProjectFileRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ProjectFile::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
    
    
}
