<?php

namespace App\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use App\Repositories\OAuthClientRepository;
use App\Entities\OAuthClient;

/**
 * Class OAuthClientRepositoryEloquent
 * @package namespace App\Repositories;
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
