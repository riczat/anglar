<?php

namespace app\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use app\Repositories\ProjectMemberRepository;
use app\Entities\ProjectMember;
use app\Presenters\ProjectMemberPresenter;

/**
 * Class ProjectMemberRepositoryEloquent
 * @package namespace app\Repositories;
 */
class ProjectMemberRepositoryEloquent extends BaseRepository implements ProjectMemberRepository
{

    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return ProjectMember::class;
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
        return ProjectMemberPresenter::class;
    }

    public function getMember($project_id, $member_id)
    {
        return ProjectMember::where(['project_id'=>$project_id,'user_id'=>$member_id])->get();
    }

}
