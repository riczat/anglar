<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

namespace App\Repositories;

use Prettus\Repository\Eloquent\BaseRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use App\Repositories\ClientRepository;
use App\Entities\Client;
use App\Presenters\ClientPresenter;

/**
 * Description of ClientRepositoryEloquent
 *
 * @author Mario
 */
class ClientRepositoryEloquent extends BaseRepository implements ClientRepository
{

    public function model()
    {
        return Client::class;
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
        return ClientPresenter::class;
    }

}
