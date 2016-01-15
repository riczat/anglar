<?php

namespace app\Entities;

use Illuminate\Database\Eloquent\Model;
use Prettus\Repository\Contracts\Transformable;
use Prettus\Repository\Traits\TransformableTrait;

class ProjectTask extends Model implements Transformable {

    use TransformableTrait;

    protected $table = "project_tasks";
    protected $fillable = [
        'id',
        'name',
        'project_id',
        'start_date',
        'due_date',
        'status'
    ];
    public function user() {
        return $this->belongsTo(Project::class, 'project_id', 'id');
    }
    public function project() {
        return $this->belongsTo(Project::class, 'project_id', 'id');
    }
}
