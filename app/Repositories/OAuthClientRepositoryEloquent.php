<?php

namespace app\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use app\Repositories\OAuthClientRepository;
use app\Entities\OAuthClient;

/**
 * Class OAuthClientRepositoryEloquent
 * @package namespace app\Repositories;
 */
class OAuthClientRepositoryEloquent extends BaseRepository implements OAuthClientRepository
{
    /**
     * Specify Model class name
     *
     * @return string
     */
    public function model()
    {
        return OAuthClient::class;
    }

    /**
     * Boot up the repository, pushing criteria
     */
    public function boot()
    {
        $this->pushCriteria(app(RequestCriteria::class));
    }
}
