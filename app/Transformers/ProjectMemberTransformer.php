<?php

namespace app\Transformers;

use League\Fractal\TransformerAbstract;
use app\Entities\User;

/**
 * Class ProjectMemberTransformer
 * @package namespace app\Transformers;
 */
class ProjectMemberTransformer extends TransformerAbstract
{

    /**
     * Transform the \ProjectMember entity
     * @param \ProjectMember $model
     *
     * @return array
     */
    public function transform(User $model)
    {

        return [
            'member_id' => $model->id,
            'name' => $model->name,
            'email' => $model->email,
            'created_at' => $model->created_at,
            'updated_at' => $model->updated_at,
        ];
    }

}
